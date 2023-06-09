// import { FormattedMessage } from 'react-intl';
import {
  Box,
  Container,
  Divider,
  InputBase,
  Paper,
  Typography,
} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import {
  createStyles,
  fade,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { Rating } from "@material-ui/lab";
import React from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { useParams, withRouter } from "react-router-dom";
import { some, SUCCESS_CODE } from "../../../constants/constants";
import { Col, Row } from "../../common/Elements";
import {
  actionGetAllProduct,
  actionProductInChild,
} from "../../system/systemAction";
import LoaddingPage from "../components/loading/LoaddingPage";
import Product from "../components/product/Product";
import SliderAds from "../components/slider/SliderAds";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      maxWidth: 900,
      transition: theme.transitions.create("transform"),
    },
    grid: {
      backgroundColor: "white",
      paddingLeft: 10,
      paddingRight: 10,
    },
    rowMoney: {
      padding: 10,
      margin: 10,
    },
    chip: {
      marginBottom: 2,
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("xl")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 1),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);
const DetailCategory = (props: some) => {
  const intl = useIntl();
  const id: some = useParams();
  const [dataCategoryChild, setDataCategoryChild] = React.useState<any>();
  const [dataListProductChild, setDataListProductChild] = React.useState<any>();
  const [idProductChild, setIdProductChild] = React.useState<string>(id.id);
  const [pageProduct, setPageProduct] = React.useState<number>(0);
  const sizeProduct = 15;
  const classes = useStyles();
  const [nameListProduct, setNameListProduct] = React.useState<string>();
  const [star, setStar] = React.useState<number>();
  const [fromPrice, setFromPrice] = React.useState<number>();
  const [toPrice, setToPrice] = React.useState<number>();
  const [searchKey, setSearchKey] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const fetchListCategory = async () => {
    try {
      const res: some = await actionGetAllProduct({ parentId: id.id });
      if (res?.code === SUCCESS_CODE) {
        setDataCategoryChild(res);
        setNameListProduct(res?.message.name);
        setIdProductChild(id.id);
        reset();
      } else {
      }
    } catch (error) {}
  };
  const fetchListProduct = async () => {
    try {
      const res: some = await actionProductInChild({
        CategoryID: idProductChild,
        page: pageProduct,
        size: sizeProduct,
        star: star,
        fromPrice: fromPrice,
        toPrice: toPrice,
        searchKey: searchKey,
      });
      if (res?.code === SUCCESS_CODE) {
        setDataListProductChild(res);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(true);
    }
  };
  React.useEffect(() => {
    fetchListCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  React.useEffect(() => {
    setLoading(false);
    fetchListProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, idProductChild, star, fromPrice, toPrice, searchKey]);

  const reset = () => {
    setStar(undefined);
    setFromPrice(undefined);
    setToPrice(undefined);
    setSearchKey("");
  };
  return (
    <div style={{ marginTop: 30, minHeight: 704 }}>
      {/* {!loading && <LoaddingPage isOpen={!loading} />} */}
      <div style={{ display: "flex" }}>
        <Col style={{ flex: 1, minWidth: 275, maxWidth: 275, marginRight: 10 }}>
          <Paper style={{ padding: 12 }}>
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", marginBottom: 12 }}
            >
              {intl.formatMessage({ id: "IDS_APP_LIST_PRODUCT" })}
            </Typography>
            {dataCategoryChild !== undefined &&
              dataCategoryChild.message.childList.map(
                (data: some, i: number) => (
                  <Typography
                    onClick={() => {
                      setIdProductChild(data.id);
                      setNameListProduct(data.name);
                      reset();
                    }}
                    key={i}
                    variant="body2"
                    style={{ marginBottom: 8, cursor: "pointer" }}
                  >
                    {data.name}
                  </Typography>
                )
              )}
            <Divider />
            {/* <Typography
              variant="body2"
              style={{ fontWeight: "bold", marginBottom: 12 }}
            >
              {intl.formatMessage({ id: "IDS_APP_DELIVERY_ADDRESS" })}
            </Typography>
            <Typography variant="body2">Tổ 7 Khu 6 Mông Dương</Typography>{" "} */}
            {/* <Divider /> */}
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={(event) => {
                  setSearchKey(event.target.value);
                  setStar(undefined);
                  setIdProductChild("");
                }}
              />
            </div>
            <Typography
              variant="body2"
              style={{ fontWeight: "bold", marginBottom: 12 }}
            >
              {intl.formatMessage({ id: "IDS_APP_VOTE" })}
            </Typography>
            <div
              onClick={() => {
                setStar(5);
                setToPrice(undefined);
                setFromPrice(undefined);
              }}
              style={{ cursor: "pointer" }}
            >
              <Typography variant="body2">
                {intl.formatMessage({ id: "IDS_APP_VOTE_FROM_5_STARTS" })}
              </Typography>
              <Rating value={5} size="small" readOnly />
            </div>
            <div
              onClick={() => {
                setStar(4);
                setToPrice(undefined);
                setFromPrice(undefined);
              }}
              style={{ cursor: "pointer" }}
            >
              <Typography variant="body2">
                {intl.formatMessage({ id: "IDS_APP_VOTE_FROM_4_STARTS" })}
              </Typography>
              <Rating value={4} size="small" readOnly />
            </div>
            <div
              onClick={() => {
                setStar(3);
                setToPrice(undefined);
                setFromPrice(undefined);
              }}
              style={{ cursor: "pointer" }}
            >
              <Typography variant="body2">
                {intl.formatMessage({ id: "IDS_APP_VOTE_FROM_3_STARTS" })}
              </Typography>
              <Rating value={3} size="small" readOnly />
            </div>
            <Divider />
            <Typography
              variant="body2"
              style={{ fontWeight: "bold", marginBottom: 12 }}
            >
              {intl.formatMessage({ id: "IDS_APP_PRICE" })}
            </Typography>
            <Chip
              size="small"
              label={"Dưới 500.000"}
              className={classes.chip}
              onClick={() => {
                setToPrice(500000);
                setFromPrice(0);
              }}
            />
            <Chip
              size="small"
              label={"Từ 500.000 đến 8.000.000"}
              className={classes.chip}
              onClick={() => {
                setToPrice(8000000);
                setFromPrice(500000);
                setStar(undefined);
              }}
            />
            <Chip
              size="small"
              label={"Từ 8.000.000 đến 18.500.000"}
              className={classes.chip}
              onClick={() => {
                setToPrice(18500000);
                setFromPrice(80000000);
                setStar(undefined);
              }}
            />
            <Chip
              size="small"
              label={"Trên 18.500.000 "}
              className={classes.chip}
              onClick={() => {
                setToPrice(100000000000);
                setFromPrice(18500000);
                setStar(undefined);
              }}
            />
          </Paper>
        </Col>
        <Col style={{ flex: 3 }}>
          <Paper>
            <Typography variant="h6" style={{ padding: "10px 20px" }}>
              {nameListProduct}
            </Typography>
            {/* <SliderAds /> */}

            {dataListProductChild !== undefined &&
            dataListProductChild.message.productsList.length > 0 ? (
              <Row
                style={{
                  flexWrap: "wrap",
                  margin: "0 auto",
                  width: "100%",
                }}
              >
                {dataListProductChild.message.productsList.map(
                  (item: some, index: number) => {
                    return <Product key={item?.id} data={item} />;
                  }
                )}
              </Row>
            ) : (
              <Col
                style={{
                  minHeight: 500,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{
                    minWidth: 100,
                    maxWidth: 100,
                  }}
                  alt="Không có sản phẩm"
                  src="https://www.orientappliances.pk//images/no.svg"
                />
                <Typography>
                  <Box fontSize={15}>Không có sản phẩm</Box>
                </Typography>
              </Col>
            )}
          </Paper>
        </Col>
      </div>
    </div>
  );
};

export default connect(
  (state: any) => ({ profile: state.system.profile }),
  {}
)(withRouter(DetailCategory));
