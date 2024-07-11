// @ts-ignore
export const getServerSideProps = async ({ res }) => {
    res.writeHead(302, {Location: '/home/coupons'});
    res.end()
  
  return {
      props: {}
    }
  }
  
  const Page = () => {
    return <></>
  }
  export default Page
  