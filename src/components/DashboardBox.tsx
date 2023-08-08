interface Props {
  children: React.ReactNode;
  loading?: boolean;
}

const DashboardComponent = ({children, loading = false }: Props) => {
  return (
    <div className="h-full w-full rounded-b-xl rounded-tr-xl bg-gradient-to-r from-[#D56DFB] to-[#0085FF] p-1">
      <div className={`flex h-full w-full items-center justify-center bg-black rounded-b-lg rounded-tr-lg back overflow-clip`}>
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
