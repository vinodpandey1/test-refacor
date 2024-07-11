import React,{ ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { setuserState } from "../../redux/features/usersSlice";

type Props = {
  state?: string,
  children: ReactNode;
};

const PageWrapper = (props: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.state) {
      // dispatch(setuserState(props.state));
    }
  }, [dispatch, props]);

  return (
    <>{props.children}</>
  );
};

export default PageWrapper;