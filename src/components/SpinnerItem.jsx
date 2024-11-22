import { ColorRing } from "react-loader-spinner";

function SpinnerItem() {
  return (
    <ColorRing
      visible={true}
      height="40"
      width="80"
      ariaLabel="color-ring-loading"
      wrapperStyle={{}}
      wrapperClass="color-ring-wrapper"
      colors={["#606C38", "#283618", "#FEFAE0", "#DDA15E", "#BC6C25"]}
    />
  );
}

export default SpinnerItem;
