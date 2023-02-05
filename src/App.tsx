import { useEffect, useRef, useState } from "react";
import * as wn from "webnative";

import { getSimpleLinks } from "webnative/fs/protocol/basic";

import { PublicFile } from "webnative/fs/v1/PublicFile";
import { PublicTree } from "webnative/fs/v1/PublicTree";

import { blogCard } from "./components/blogCard";
// move to env
const USERNAME_TO_LOOKUP = "Adam Sobotka#did:key:z13V3Sog2YaUKhdGCmgx9UZuW1o1ShFJYc6DvGYe7NTt689NoL36k5XCatwtBfq4q4rqmmsGBhRwmsRiuePthN7uwDRPvbanMzYaFvxVjWhV5ehJx8fwohpCtHkynPXmQsAYw26hk12nu3vA9nRZe4qqaTRrySrfcouXXhdA2uPrFscRdc9DHjr8hY1CmzHxyj5DuujbhMKz52tL9UkqW6UTALM9CEqi9rfhxFg7i4dsECbg1iR76XjqmZ9nLxPFws7tkV89yTLihS27P3EyE77vtS6X5TmPyt9ZzJJUJagfaNUfCUN2qPfcZm2jYMo7c7YPACwoPkfha5DGfgYpAa8oTD7GGot1WSD8SiviybtiT2BfpnYSoXvJsMjtTVJomtJLbCUiuEb4SSS1kNyBZep";

function App() {
  const [blogPosts, setBlogPosts] = useState();
  async function loadPosts() {
    const program = await wn.program({
      // move to env
      namespace: { creator: "Blockenberg", name: "BBG" },
    });

    const { depot, reference } = program.components;

    const cid = await reference.dataRoot.lookup(USERNAME_TO_LOOKUP);
    if (!cid) return;
    const publicCid = (await getSimpleLinks(depot, cid)).public.cid as wn.CID;
    const publicTree = await PublicTree.fromCID(depot, reference, publicCid);

    const unsplashDir = await publicTree.get(
      wn.path.unwrap(wn.path.directory("Unsplash")), // [ "Unsplash" ]
    );
    if (!unsplashDir) return;
    const links = Object.values(
      //@ts-expect-error
      await unsplashDir.ls([]),
    );
    console.log(links);
  }
  useEffect(() => {
    //console.log("useEffect");
    loadPosts();
  }, [blogPosts]);
  return (
    <>
      <section>
        <div className="container max-w-6xl p-6 mx-auto space-y-6 sm:space-y-12">
          <a
            rel="noopener noreferrer"
            href="#"
            className="block max-w-sm gap-3 mx-auto sm:max-w-full group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 dark:dark:bg-zinc-900"
          >
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
          </a>
          <div className="grid justify-center grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogCard}
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
