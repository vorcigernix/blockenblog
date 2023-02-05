import { useEffect, useRef, useState } from "react";
import * as wn from "webnative";

import { getSimpleLinks } from "webnative/fs/protocol/basic";
import { Link } from "webnative/fs/types";
//import { PublicFile } from "webnative/fs/v1/PublicFile";
import { PublicTree } from "webnative/fs/v1/PublicTree";
import { BlogCard, type CardProps } from "./components/BlogCard";
// move to env & change to your token
const USERNAME_TO_LOOKUP = "mmkooe7pj6p6avi66mwq5n63muuwjyfm";

function App() {
  const [blogPosts, setBlogPosts] = useState<CardProps[]>([]);
  async function loadPosts() {
    const program = await wn.program({
      namespace: { creator: "Blockenberg", name: "BBG" },
    });

    const { depot, reference } = program.components;

    const cid = await reference.dataRoot.lookup(USERNAME_TO_LOOKUP);
    if (!cid) return;
    const publicCid = (await getSimpleLinks(depot, cid)).public.cid as wn.CID;
    const publicTree = await PublicTree.fromCID(depot, reference, publicCid);
    //console.log(publicTree);

    const publicDocDir = await publicTree.get(
      wn.path.unwrap(wn.path.directory("documents")),
    );
    const publicPicDir = await publicTree.get(
      wn.path.unwrap(wn.path.directory("gallery")),
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
        //const file = await PublicFile.fromCID(depot, post.cid);
        const filecontent = new TextDecoder().decode(file.content);
        const filecontentjson = JSON.parse(filecontent);
        const imagejson = JSON.parse(filecontentjson.image);
        //console.log(filecontentjson.header, imagejson.name);
        //@ts-expect-error
        const image = await publicPicDir.get([imagejson.name]);
        //console.log(image);

        // Picture `src`
        const url = URL.createObjectURL(new Blob([image.content]));
        console.log(url);

        return { post: filecontentjson, image: url };
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
      <section>
        <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
          <div className="block max-w-sm gap-3 mx-auto sm:max-w-full lg:grid lg:grid-cols-12 dark:dark:bg-zinc-900">
            <img
              src="https://images.unsplash.com/photo-1590492123569-42905d752c86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80"
              alt=""
              className="object-cover w-full h-64 grayscale hover:grayscale-0 transition duration-700  sm:h-96 lg:col-span-7 dark:dark:bg-gray-500"
            />
            <div className="p-6 lg:col-span-5 text-left">
              <h3 className="text-2xl my-4 font-semibold sm:text-4xl group-hover:underline group-focus:underline">
                The Gray Zone
              </h3>
              <span className="text-xs dark:dark:text-gray-400">
                Since February 2023
              </span>
              <p className="mt-2">
                “When a man is denied the right to live the life he believes in,
                he has no choice but to become an outlaw.”
              </p>
              <p className="mt-4">
                Nelson Mandela
              </p>
            </div>
          </div>
          <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts &&
              blogPosts.map((post, i) => (
                <BlogCard post={post.post} image={post.image} key={i} />
              ))}
          </div>
          <div className="justify-center hidden">
            <button
              type="button"
              className="px-6 py-3 text-sm -md hover:underline dark:dark:bg-zinc-900 dark:dark:text-gray-400"
            >
              Load more posts...
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
