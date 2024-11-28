const HTMLContentRenderer = ({ content, limit }) => {
  if (!content) return null;

  // Only add ellipsis if content length exceeds limit
  const processedContent =
    limit && content.length > limit
      ? `${content.substring(0, limit)}...`
      : content;

  const defaultStyles = `
    <style>
      /* Headings */
      h1 { @apply text-2xl font-bold mb-4 text-gray-900; }
      h2 { @apply text-xl font-bold mb-3 text-gray-900; }
      h3 { @apply text-lg font-bold mb-2 text-gray-900; }
      h4 { @apply text-base font-bold mb-2 text-gray-900; }
      h5 { @apply text-sm font-bold mb-2 text-gray-900; }
      h6 { @apply text-xs font-bold mb-2 text-gray-900; }

      /* Paragraphs and text */
      p { @apply mb-4 text-gray-700 leading-relaxed; }
      strong, b { @apply font-bold text-gray-900; }
      em, i { @apply italic text-gray-700; }
      u { @apply underline decoration-1; }
      s, strike { @apply line-through text-gray-500; }
      
      /* Links */
      a { @apply text-blue-600 hover:text-blue-800 underline; }
      
      /* Lists */
      ul { @apply list-disc list-inside mb-4 space-y-1 text-gray-700; }
      ol { @apply list-decimal list-inside mb-4 space-y-1 text-gray-700; }
      li { @apply mb-1; }
      li > ul, li > ol { @apply ml-4 mt-1; }
      
      /* Blockquotes */
      blockquote { 
        @apply pl-4 py-2 mb-4 border-l-4 border-gray-300 bg-gray-50 text-gray-700 italic;
      }
      
      /* Code blocks */
      pre { @apply bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto; }
      code { @apply bg-gray-100 px-1 py-0.5 rounded text-sm font-mono; }
      
      /* Tables */
      table { @apply w-full mb-4 border-collapse; }
      th { @apply bg-gray-100 p-2 border border-gray-300 font-bold text-left; }
      td { @apply p-2 border border-gray-300; }
      
      /* Horizontal rule */
      hr { @apply my-6 border-gray-300; }
      
      /* Images */
      img { @apply max-w-full h-auto rounded mb-4; }
      
      /* Definition lists */
      dl { @apply mb-4; }
      dt { @apply font-bold mb-1; }
      dd { @apply ml-4 mb-2; }
      
      /* Mark/Highlight */
      mark { @apply bg-yellow-200 px-1; }
      
      /* Subscript/Superscript */
      sub { @apply text-xs align-sub; }
      sup { @apply text-xs align-super; }
    </style>
  `;

  return (
    <div
      className="prose max-w-none
        prose-headings:font-bold 
        prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
        prose-p:mb-4 prose-p:text-gray-700
        prose-strong:font-bold prose-strong:text-gray-900
        prose-a:text-blue-600 prose-a:hover:text-blue-800
        prose-ul:list-disc prose-ul:list-inside
        prose-ol:list-decimal prose-ol:list-inside
        prose-li:mb-1
        prose-blockquote:border-l-4 prose-blockquote:border-gray-300
        prose-blockquote:bg-gray-50 prose-blockquote:italic
        prose-img:max-w-full prose-img:h-auto
        prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg
        prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded"
      dangerouslySetInnerHTML={{
        __html: defaultStyles + processedContent,
      }}
    />
  );
};

export default HTMLContentRenderer;
