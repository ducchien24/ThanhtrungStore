import { IconButton, Typography, Button, Tooltip } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ReactComponent as IconDelete } from "../../../assets/icons/ic_delete.svg";
import { some, SUCCESS_CODE } from "../../../constants/constants";
import { routes } from "../../../constants/routes";
import ConfirmDialog from "../../common/ConfirmDialog";
import { snackbarSetting } from "../../common/Elements";
import { actionDeleteAccountAdmin } from "../../system/systemAction";
import {
  actionDeleteBillFromStore,
  actionDeleteCategory,
  actionDeleteProduct,
  actionSetStatusCancel,
} from "../managerAction";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { RED_500 } from "../../../assets/theme/colors";
import CloseIcon from "@material-ui/icons/Close";
interface Props {
  item: some;
  fetchData: () => void;
  category?: boolean;
  cancelBill?: boolean;
}

const DeleteDialog: React.FC<RouteComponentProps<any> & Props> = (props) => {
  const { item, fetchData, category, cancelBill } = props;
  const { pathname } = props?.location;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const showNotifySnack = (res: any) => {
    enqueueSnackbar(
      res?.message,
      snackbarSetting((key) => closeSnackbar(key), {
        color: res?.code === SUCCESS_CODE ? "success" : "error",
      })
    );
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      let res: some = {};
      if (pathname === routes.ACCOUNT_MANAGEMENT)
        res = await actionDeleteAccountAdmin(JSON.stringify(item?.userName));
      else if (pathname === routes.CATEGORY_MANAGER)
        res = await actionDeleteCategory({
          ID: item?.id,
        });
      // res = await actionDeleteShortcut(item?.id);
      else if (pathname === routes.PRODUCT_MANAGEMENT)
        res = await actionDeleteProduct(JSON.stringify(item?.id));
      else if (pathname === routes.STORE_PRODUCT_MANAGEMENT)
        res = await actionDeleteProduct(JSON.stringify(item?.id));
      else if (pathname === routes.STORE_MANAGER_PRODUCT)
        res = await actionDeleteProduct(JSON.stringify(item?.id));
      else if (pathname === routes.TRANSACTION_MANAGEMENT) {
        let temp: some = {};
        temp = await actionSetStatusCancel({
          transID: item?.billID,
        });
        if (temp?.code === SUCCESS_CODE)
          res = await actionDeleteBillFromStore({
            billID: item?.billID,
          });
      } else if (pathname === routes.STORE_TRANSACTION_MANAGEMENT) {
        let temp: some = {};
        temp = await actionSetStatusCancel({
          transID: item?.billID,
        });
        if (temp?.code === SUCCESS_CODE)
          res = await actionDeleteBillFromStore({
            billID: item?.billID,
          });
      } else if (pathname === routes.STORE_MANAGER_TRANSACTION) {
        let temp: some = {};
        temp = await actionSetStatusCancel({
          transID: item?.billID,
        });
        if (temp?.code === SUCCESS_CODE)
          res = await actionDeleteBillFromStore({
            billID: item?.billID,
          });
      }
      if (res?.code === SUCCESS_CODE) fetchData();
      showNotifySnack(res);
    } catch (error) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  const getContent = () => {
    // if (pathname === routes.TAG_MANAGEMENT) return item?.name;
    if (pathname === routes.SHORTCUT_MANAGEMENT) return item?.key;
    // if (pathname === routes.TEAM_MANAGEMENT) return item?.name;
    if (pathname === routes.EMPLOYEE_MANAGEMENT) return item?.id;
    return item?.name;
  };
  return (
    <>
      {category ? (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          style={{
            // minWidth: 132,
            // marginLeft: 24,
            background: RED_500,
          }}
          disableElevation
          onClick={handleOpen}
        >
          <DeleteOutlineIcon />
        </Button>
      ) : cancelBill ? (
        <Tooltip title="Hủy đơn hàng">
          <IconButton onClick={handleOpen}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton title="Xóa" onClick={handleOpen}>
          <IconDelete />
        </IconButton>
      )}

      <ConfirmDialog
        titleLabel={
          <Typography variant="subtitle1" style={{ margin: "12px 16px" }}>
            <FormattedMessage
              id="IDS_CHAT_DELETE"
              values={{ value: pathname.split("/").pop() }}
            />
          </Typography>
        }
        maxWidth="md"
        fullWidth={false}
        open={open}
        onClose={handleClose}
        onReject={handleClose}
        onAccept={handleSubmit}
        loading={loading}
      >
        <div
          style={{ textAlign: "center", padding: "24px 16px", minHeight: 120 }}
        >
          <Typography
            variant="body2"
            style={{ marginBottom: 0, padding: "0 16px", fontWeight: 500 }}
          >
            <FormattedMessage
              id="IDS_CHAT_DELETE_DESCRIPTION"
              values={{ value: getContent() }}
            />
          </Typography>
        </div>
      </ConfirmDialog>
    </>
  );
};

export default withRouter(DeleteDialog);
