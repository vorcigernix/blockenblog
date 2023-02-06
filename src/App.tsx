import { Suspense, lazy } from "react";
const BlogList = lazy(() => import('./components/BlogList'));
//import { BlogList } from "./components/BlogList";
// move to env & change to your token
const USERNAME_TO_LOOKUP = "mmkooe7pj6p6avi66mwq5n63muuwjyfm";

const Loading = () => {
  return (
    <>
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin dark:border-gray-50 border-gray-800">
      </div>
    </>
  );
};

function App() {
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
            <Suspense fallback={<Loading />}>
              <BlogList token={USERNAME_TO_LOOKUP} />
            </Suspense>
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
