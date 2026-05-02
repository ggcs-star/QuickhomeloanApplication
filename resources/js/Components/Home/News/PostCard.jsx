import { Grid, Calendar } from "lucide-react";


const IMAGE_BASE_URL = "https://news.quickhomeloan.in/";

export default function PostCard({ post }) {
  const postUrl = `https://news.quickhomeloan.in/${post.title_slug}`;

  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = postUrl;
  };

  const date = new Date(post.created_at || Date.now()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });


  const imagePath = post.image_slider || post.image_mid || post.image_big || post.image;


  const fullImageUrl = imagePath
    ? (imagePath.startsWith("http")
      ? imagePath
      : `${IMAGE_BASE_URL}${imagePath}`)
    : "/images/Home/news-default-big.png";

  return (
    <a
      href={postUrl}
      onClick={handleClick}
      className="block bg-white rounded-[20px] md:rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-2.5 md:p-3 pb-3 md:pb-4 group"
    >
      {/* Top Image */}
      <div className="w-full h-[160px] md:h-[180px] rounded-[14px] md:rounded-[16px] overflow-hidden bg-gray-100 relative">
        <img
          src={fullImageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Title */}
      <h3 className="mt-3 md:mt-4 px-1.5 text-[15px] md:text-[17px] font-bold text-gray-900 line-clamp-2 leading-snug">
        {post.title}
      </h3>

      {/* Subtle Divider */}
      <div className="mt-3 md:mt-4 mb-2.5 md:mb-3 border-b border-gray-100 mx-1.5" />

      {/* Footer Info (Icons & Text) */}
      <div className="flex items-center justify-between px-1.5 text-[12px] md:text-[13px] font-medium">
        <div className="flex items-center gap-1.5">
          <Grid size={14} className="text-[#3b82f6] md:w-4 md:h-4" />
          <span className="text-gray-500 line-clamp-1">{post.category_name}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Calendar size={14} className="text-[#3b82f6] md:w-4 md:h-4" />
          <span className="text-gray-500">{date}</span>
        </div>
      </div>
    </a>
  );
}