interface Props {
  loading: boolean;
  padding?: boolean;
  children?: React.ReactNode;
}

const DashboardComponent = (props: Props) => {
  const { loading, padding, children } = props;
  return (
    <div className="h-full w-full rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1">
      <div className={`flex h-full w-full items-center justify-center bg-gray-800 rounded-md back overflow-scroll ${padding !== false && "p-4"}`}>
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
