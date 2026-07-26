export function DraftingTitleBlock() {
  return (
    <div className="fixed bottom-4 right-4 border-2 border-gray-700 bg-black/80 backdrop-blur-sm z-50">
      <div className="grid grid-cols-2 text-xs">
        {/* Row 1: Name | Discipline */}
        <div className="border-r border-b border-gray-700 p-2">
          <div className="text-gray-500 text-[10px] uppercase">Name</div>
          <div className="text-white">Rohan Singh</div>
        </div>
        <div className="border-b border-gray-700 p-2">
          <div className="text-gray-500 text-[10px] uppercase">Discipline</div>
          <div className="text-white">Mechanical Engineer</div>
        </div>

        {/* Row 2: Email | GitHub */}
        <div className="border-r border-b border-gray-700 p-2">
          <div className="text-gray-500 text-[10px] uppercase">Email</div>
          <div className="text-white text-[9px]">rhan.singh@mail.utoronto.ca</div>
        </div>
        <div className="border-b border-gray-700 p-2">
          <div className="text-gray-500 text-[10px] uppercase">GitHub</div>
          <div className="text-white text-[9px]">github.com/RohanLefty</div>
        </div>

        {/* Row 3: LinkedIn | Scale */}
        <div className="border-r border-gray-700 p-2">
          <div className="text-gray-500 text-[10px] uppercase">LinkedIn</div>
          <div className="text-white text-[9px]">linkedin.com/in/rhansingh</div>
        </div>
        <div className="p-2">
          <div className="text-gray-500 text-[10px] uppercase">Scale</div>
          <div className="text-white">1:1</div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-2 border-gray-700 px-2 py-1 text-[10px] text-gray-500 uppercase tracking-wider">
        Mechanical Engineering Portfolio
      </div>
    </div>
  );
}
