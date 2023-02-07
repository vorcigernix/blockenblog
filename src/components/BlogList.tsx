import { useEffect, useState } from "react";
import { CID, path, program } from "webnative";
import { getSimpleLinks } from "webnative/fs/protocol/basic";
import { Link } from "webnative/fs/types";
import { PublicTree } from "webnative/fs/v1/PublicTree";

import { BlogCard, type CardProps } from "./BlogCard";
export const BlogList = (props: { token: string }) => {
  const [blogPosts, setBlogPosts] = useState<CardProps[]>([]);
  async function loadPosts() {
    const prog = await program({
      namespace: { creator: "Blockenberg", name: "BBG" },
    });

    const { depot, reference } = prog.components;

    const cid = await reference.dataRoot.lookup(props.token);
    if (!cid) return;
    const publicCid = (await getSimpleLinks(depot, cid)).public.cid as CID;
    const publicTree = await PublicTree.fromCID(depot, reference, publicCid);
    //console.log(publicTree);

    const publicDocDir = await publicTree.get(
      path.unwrap(path.directory("documents")),
    );
    const publicPicDir = await publicTree.get(
      path.unwrap(path.directory("gallery")),
    );

    //console.log(publicPicDir);
    if (!publicDocDir) return;
    const links: Link[] = Object.values(
      //@ts-expect-error
      await publicDocDir.ls([]),
    );

    const posts = await Promise.all(
      links.map(async (post) => {
        //@ts-expect-error
        const file = await publicDocDir.get([post.name]);
        //console.log(file);
        //const file = await PublicFile.fromCID(depot, post.cid);
        const filecontent = new TextDecoder().decode(file.content);
        const updated = file.header.metadata.unixMeta.mtime;
        const filecontentjson = JSON.parse(filecontent);
        const imagejson = JSON.parse(filecontentjson.image);
        //console.log(filecontentjson.header, imagejson.name);
        //@ts-expect-error
        const image = await publicPicDir.get([imagejson.name]);
        //console.log(image);

        // Picture `src`
        const url = URL.createObjectURL(new Blob([image.content]));
        //console.log(url);

        return { post: filecontentjson, image: url, updated: updated };
      }),
    );
    console.log(posts);
    setBlogPosts(posts);
  }
  useEffect(() => {
    loadPosts();
  }, []);
  return (
    <>
      {blogPosts &&
        blogPosts.map((post, i) => (
          <BlogCard
            post={post.post}
            image={post.image}
            updated={post.updated}
            key={i}
          />
        ))}
    </>
  );
};

export default BlogList;
