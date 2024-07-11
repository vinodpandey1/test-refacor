import { useRouter } from "next/router";
import { Breadcrumbs, Link } from "@mui/material";
import { grey } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import React from "react";
import { defaultBlackColor } from "@iconify/tools/lib/colors/attribs";

const GenerateBreadcrumbs = () => {
  const router = useRouter();
  const pathArray = router.pathname.split("/").filter((path) => path !== "");

  const breadcrumbs = pathArray.map((path, index) => {
    const href = `/${pathArray.slice(0, index + 1).join("/")}`;
    const isLast = index === pathArray.length - 1;
    let label = path.charAt(0).toUpperCase() + path.slice(1);

    if (path.startsWith("[") && path.endsWith("]")) {
      const dynamicParam = router.query[path.slice(1, -1)];
      label = dynamicParam ? dynamicParam.toString() : path;
    }

    return { href, label, isLast };
  });

  return (
    <>
      <Breadcrumbs sx={{ fontSize: 22 }} aria-label="breadcrumb">
        {breadcrumbs?.map((itm, key) =>
          itm.isLast ? (
            <Typography key={key} fontSize={20}>
              {itm.label}
            </Typography>
          ) : (
            <Link
              key={key}
              className={"here"}
              underline="hover"
              sx={{
                color: itm.isLast
                  ? defaultBlackColor
                  : grey[500] + "!important",
              }}
              href={itm.href}
            >
              <Typography color={"aqua"} fontSize={20}>
                {itm.label}
              </Typography>
            </Link>
          )
        )}
      </Breadcrumbs>
      <br />
    </>
  );
};

export default GenerateBreadcrumbs;
