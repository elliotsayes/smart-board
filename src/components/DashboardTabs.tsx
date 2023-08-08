interface Props {
  tabIndex: number;
  onTabChange: (index: number) => void;
  titles: string[];
  children: React.ReactNode[];
}

const DashboardTabs = ({tabIndex, onTabChange, titles, children}: Props) => {
  return (
    <div>
      {/* Horizontal Tab Titles */}
      <ul className="flex pr-4 gap-0.5">
        {
          titles.map((title, index) => (
            <li 
              key={index}
              onClick={() => onTabChange && onTabChange(index)}
              className={`cursor-pointer w-72 text-center text-white hover:text-gray-300 rounded-tr-full bg-gradient-to-r from-[#D56DFB] to-[#0085FF] px-1 pt-1`}
            >
              <div className={`${tabIndex === index ? 'bg-white/0' : 'bg-gray-800'} font-bold transition-colors duration-200 rounded-tr-full py-0.5`}>
                {title}
              </div>
            </li>
          ))
        }
      </ul>
      {/* Content */}
      <div>
        {children[tabIndex]}
      </div>
    </div>
  )
}

export default DashboardTabs