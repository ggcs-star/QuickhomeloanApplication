import {
  Calendar,
  Clock3,
  Bookmark,
} from "lucide-react";

const IMAGE_BASE_URL = "https://news.quickhomeloan.in/";

export default function PostCard({ post }) {
  const postUrl = `https://news.quickhomeloan.in/${post.title_slug}`;

  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = postUrl;
  };

  const date = new Date(
    post.created_at || Date.now()
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const imagePath =
    post.image_slider ||
    post.image_mid ||
    post.image_big ||
    post.image;

  const fullImageUrl = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${IMAGE_BASE_URL}${imagePath}`
    : "/images/Home/news-default-big.png";

  return (
    <a
      href={postUrl}
      onClick={handleClick}
      className="
        block
        bg-white
        rounded-[18px]
        border
        border-gray-100
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        overflow-hidden
        group
      "
    >
<div className="flex w-full">
        {/* IMAGE */}
        <div
          className="
            w-[38%]
            shrink-0
            bg-gray-100
            overflow-hidden
            flex
            items-center
            justify-center
          "
        >
          <img
            src={fullImageUrl}
            alt={post.title}
            className="
              w-full
              h-full
              min-h-[130px]
              object-contain
              group-hover:scale-105
              transition-transform
              duration-500
            "
          />
        </div>

        {/* CONTENT */}
        <div
          className="
flex-1 overflow-hidden            min-w-0
            px-3
            py-3
            pr-3
            flex
            flex-col
            justify-between
          "
        >

          {/* TOP */}
          <div>

            {/* CATEGORY + BOOKMARK */}
            <div className="flex items-start justify-between gap-2">

              <span
                className="
                  bg-[#eef2ff]
                  text-[#2563eb]
                  text-[10px]
                  font-semibold
                  px-2.5
                  py-1
                  rounded-full
                  whitespace-nowrap
                "
              >
                {post.category_name || "Home Loan"}
              </span>

              <Bookmark
                size={16}
                strokeWidth={2}
                className="text-gray-400 shrink-0"
              />
            </div>

            {/* TITLE */}
            <h3
              className="
                mt-2.5
                text-[15px]
                leading-[21px]
                font-bold
                text-[#111827]
                line-clamp-3
              "
            >
              {post.title}
            </h3>
          </div>

          {/* FOOTER */}
          <div className="flex items-center gap-3 mt-3 text-gray-500">

            {/* DATE */}
            <div className="flex items-center gap-1">
              <Calendar size={13} />
              <span className="text-[11px]">
                {date}
              </span>
            </div>

            {/* READ TIME */}
            <div className="flex items-center gap-1">
              <Clock3 size={13} />
              <span className="text-[11px]">
                5 min read
              </span>
            </div>

          </div>
        </div>
      </div>
    </a>
  );
}