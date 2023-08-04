interface Props {
  children: React.ReactNode;
  loading?: boolean;
  padding?: boolean;
}

const DashboardComponent = ({children, loading = false, padding = true }: Props) => {
  return (
    <div className="h-full w-full rounded-lg bg-gradient-to-r from-[#D56DFB] to-[#0085FF] p-1">
      <div className={`flex h-full w-full items-center justify-center bg-gray-800 rounded-md back overflow-clip ${padding && "p-4"}`}>
        {
          loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {children}
            </>
          )
        }
      </div>
    </div>
  );
};

export default DashboardComponent;
