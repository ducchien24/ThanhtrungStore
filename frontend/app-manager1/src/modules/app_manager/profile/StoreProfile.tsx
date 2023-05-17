import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router";
import { RouteComponentProps, withRouter } from "react-router-dom";
import * as yup from "yup";
import { some, SUCCESS_CODE, USER_PROFILE } from "../../../constants/constants";
import { Col, Row, snackbarSetting } from "../../common/Elements";
import FormControlTextField from "../../common/FormControlTextField";
import HeaderManagement from "../components/HeaderManagement";
import "../Management.scss";
import Rating from "@material-ui/lab/Rating";
import { actionGetStoreByID, actionUpdateStore } from "../managerAction";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

interface Props {}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const StoreProfile: React.FC<RouteComponentProps<any> & Props> = (props) => {
  const history = useHistory();
  const profile = JSON.parse(localStorage.getItem(USER_PROFILE) || "{}");
  const [store, setStoreData] = React.useState<some>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [value, setValueChange] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValueChange(newValue);
  };

  const schema = yup.object().shape({
    Name: yup.string().required("Tên sản phẩm không được để trống").nullable(),
    Detail: yup
      .string()
      .required("Tên sản phẩm không được để trống")
      .nullable(),
  });

  const { handleSubmit, getValues, control, formState, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Name: store?.name,
      Detail: store?.detail,
    },
  });
  const { errors } = formState;

  const fetchGetStoreByID = async () => {
    try {
      const res: some = await actionGetStoreByID({
        StoreID: profile?.store?.id,
      });
      if (res?.code === SUCCESS_CODE) {
        if (res?.store) {
          setStoreData(res?.store);
        }
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(true);
    }
  };

  React.useEffect(() => {
    fetchGetStoreByID();
  }, []);

  React.useEffect(() => {
    setValue("Name", store?.name, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("Detail", store?.detail, {
      shouldValidate: true,
      shouldDirty: true,
    });fetchGetStoreByID();
  }, [store]);

  const onSubmit = async (data: any) => {
    try {
      const res: any = await actionUpdateStore({
        ...data,
      });
      if (res?.code === SUCCESS_CODE) {
        // const { data } = await actionGetEmployeesInfo();
        fetchGetStoreByID();
        enqueueSnackbar(
          res?.message,
          snackbarSetting((key) => closeSnackbar(key), { color: "error" })
        );
      } else {
        enqueueSnackbar(
          res?.message,
          snackbarSetting((key) => closeSnackbar(key), { color: "error" })
        );
      }
    } catch (error) {}
  };

  return (
    <div className="management-container">
      {/* <HeaderManagement fetchData={fetchData} searchData={searchEmployee} /> */}
      <HeaderManagement fetchData={() => {}} />
      {loading ? (
        <Paper style={{ padding: 20 }}>
          <Paper
            elevation={0}
            style={{
              width: "100%",
              height: 100,
              display: "flex",
              alignItems: "center",
              backgroundImage: `url("https://png.pngtree.com/thumb_back/fh260/background/20190827/pngtree-abstract-80s-trendy-geometric-background-neon-colors-image_304908.jpg")`,
            }}
          >
            <Row
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: 20,
              }}
            >
              <Row>
                <Avatar
                  alt="Remy Sharp"
                  src="https://img.icons8.com/color/48/000000/shop.png"
                  style={{
                    backgroundColor: "white",
                    width: 60,
                    height: 60,
                    padding: 10,
                  }}
                />
                <Col
                  style={{
                    marginLeft: 15,
                    paddingRight: 10,
                  }}
                >
                  <Typography>
                    <Box
                      fontSize={20}
                      fontWeight="bold"
                      style={{ color: "white" }}
                    >
                      {store?.name}
                    </Box>
                  </Typography>
                  <Typography>
                    <Box fontSize={15} style={{ color: "#c9c9c9" }}>
                      {store?.followerCount} lượt theo dõi
                    </Box>
                  </Typography>
                  <Typography>
                    <Rating name="read-only" value={store?.star} readOnly />
                  </Typography>
                </Col>
              </Row>
            </Row>
          </Paper>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab
              label="Thông tin cửa hàng"
              style={{ fontSize: 15 }}
              {...a11yProps(0)}
            />
            <Tab
              label="Thông tin chủ cửa hàng"
              style={{ fontSize: 15 }}
              {...a11yProps(1)}
            />
          </Tabs>
          <TabPanel value={value} index={0}>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="none">
              <Controller
                as={React.forwardRef((itemProps: any, ref) => (
                  <FormControlTextField
                    {...itemProps}
                    label={<FormattedMessage id="IDS_CHAT_STORE_NAME" />}
                    formControlStyle={{ width: "100%", marginRight: 0 }}
                    inputProps={{ maxLength: 50, autoComplete: "none" }}
                    inputRef={ref}
                    errorMessage={errors.Name?.message}
                  />
                ))}
                name="Name"
                control={control}
              />
              <Controller
                as={React.forwardRef((itemProps: any, ref) => (
                  <FormControlTextField
                    {...itemProps}
                    label={<FormattedMessage id="IDS_CHAT_STORE_DETAIL" />}
                    formControlStyle={{ width: "100%", marginRight: 0 }}
                    inputProps={{ maxLength: 50, autoComplete: "none" }}
                    multiline
                    rows={5}
                    inputRef={ref}
                    errorMessage={errors.Detail?.message}
                  />
                ))}
                name="Detail"
                control={control}
              />
              <Button
                color="primary"
                style={{
                  marginRight: 20,
                  fontSize: 15,
                  fontStyle: "unset",
                }}
                variant="contained"
                type="submit"
              >
                Sửa thông tin
              </Button>
            </form>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Typography
              style={{
                fontSize: 15,
                marginTop: 5,
              }}
            >
              Họ và tên:
            </Typography>
            <TextField
              disabled
              fullWidth
              id="standard-disabled"
              margin="dense"
              defaultValue={profile?.store?.owner?.name}
            />
            <Typography
              style={{
                fontSize: 15,
                marginTop: 5,
              }}
            >
              Email:
            </Typography>
            <TextField
              disabled
              fullWidth
              id="standard-disabled"
              margin="dense"
              defaultValue={profile?.store?.owner?.email}
            />
            <Typography
              style={{
                fontSize: 15,
                marginTop: 5,
              }}
            >
              Số điện thoại:
            </Typography>
            <TextField
              disabled
              fullWidth
              id="standard-disabled"
              margin="dense"
              defaultValue={profile?.store?.owner?.phoneNumber}
            />
            <Typography
              style={{
                fontSize: 15,
                marginTop: 5,
              }}
            >
              Ngày sinh:
            </Typography>
            <TextField
              disabled
              fullWidth
              id="standard-disabled"
              margin="dense"
              defaultValue={new Date(
                profile?.store?.owner?.dateOfBirth
              ).toLocaleDateString()}
            />
            <Typography
              style={{
                fontSize: 15,
                marginTop: 5,
              }}
            >
              Giới tính:
            </Typography>
            <TextField
              disabled
              fullWidth
              id="standard-disabled"
              margin="dense"
              defaultValue={
                profile?.store?.owner?.gender === "M"
                  ? "Nam"
                  : profile?.store?.owner?.gender === "F"
                  ? "Nữ"
                  : "Khác"
              }
            />
          </TabPanel>
        </Paper>
      ) : (
        <Box
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "25%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};
export default withRouter(StoreProfile);
function enqueueSnackbar(message: any, arg1: any) {
  throw new Error("Function not implemented.");
}

function closeSnackbar(key: string): void {
  throw new Error("Function not implemented.");
}
