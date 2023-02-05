import { useState } from "react";
export type CardProps = { post: any; image: string };

function createMarkup(markup: string) {
  return { __html: markup };
}

export const BlogCard = (props: CardProps) => {
  const [focus, setFocus] = useState(false);
  return (
    <div className="flex flex-col w-full justify-start items-center ">
      <button
        onClick={() => {
          setFocus(!focus);
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
        className={`group hover:no-underline focus:no-underline dark:dark:bg-zinc-900  ${
          focus ? "absolute inset-0" : "max-w-sm "
        }`}
      >
        <img
          role="presentation"
          className={`object-cover w-full dark:dark:bg-gray-500 ${
            focus ? "h-1/3" : "h-44"
          }`}
          src={props.image}
        />
        <div className="p-6 space-y-2">
          <h3 className="text-2xl font-bold group-hover:underline group-focus:underline text-ellipsis overflow-hidden truncate">
            {decodeURI(props.post.header)}
          </h3>
          <span className="text-xs dark:dark:text-gray-400">
            January 21, 2021
          </span>
          <p
            dangerouslySetInnerHTML={createMarkup(props.post.content)}
            className="h-60 overflow-hidden"
          />
        </div>
      </button>
    </div>
  );
};
