export type CardProps = { post: any; image: string };

function createMarkup(markup: string) {
  return { __html: markup };
}

export const BlogCard = (props: CardProps) => (
  <a
    rel="noopener noreferrer"
    href="#"
    className="max-w-sm mx-auto group hover:no-underline focus:no-underline dark:dark:bg-zinc-900"
  >
    <img
      role="presentation"
      className="object-cover w-full h-44 dark:dark:bg-gray-500"
      src={props.image}
    />
    <div className="p-6 space-y-2">
      <h3 className="text-2xl font-bold group-hover:underline group-focus:underline text-ellipsis overflow-hidden">
        {decodeURI(props.post.header)}
      </h3>
      <span className="text-xs dark:dark:text-gray-400">
        January 21, 2021
      </span>
      <p dangerouslySetInnerHTML={createMarkup(props.post.content)} className="h-48 text-ellipsis overflow-hidden" />
    </div>
  </a>
);
