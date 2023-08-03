interface Props {
  loading: boolean;
  padding?: boolean;
  children?: React.ReactNode;
}

const DashboardComponent = (props: Props) => {
  const { loading, padding, children } = props;
  return (
    <div className="h-full w-full rounded-lg bg-gradient-to-r from-[#D56DFB] to-[#0085FF] p-1">
      <div className={`flex h-full w-full items-center justify-center bg-gray-800 rounded-md back overflow-clip ${padding !== false && "p-4"}`}>
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
