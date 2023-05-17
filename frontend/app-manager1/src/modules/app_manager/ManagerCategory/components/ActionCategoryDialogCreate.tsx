import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@material-ui/core";
import { Editor } from "@tinymce/tinymce-react";
import JSONbig from "json-bigint";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router-dom";
import * as yup from "yup";
import { some, SUCCESS_CODE } from "../../../../constants/constants";
import { Col, snackbarSetting } from "../../../common/Elements";
import FormControlTextField from "../../../common/FormControlTextField";
import ActionDialogCreate from "../../components/ActionDialogCreate";
import FirebaseUpload from "../../firebaseupload/FirebaseUpload";
import FirebaseUploadCategory from "../../firebaseupload/FirebaseUploadCategory";
import { actionAddCategory, actionAddProduct } from "../../managerAction";
import ProductCategory from "../../ManagerProduct/components/ProductCategory";
interface Props {
  itemParent?: some;
  fetchData: () => void;
  titleTooltip?: string;
}

const ActionCategoryDialogCreate: React.FC<RouteComponentProps<any> & Props> = (
  props
) => {
  const { itemParent, fetchData, titleTooltip } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [imageCategory, setImageCategory] = React.useState<string>("");
  const [valid, setValid] = useState<boolean>(false);
  const formid = "formCategoryDialogCreate" + itemParent?.id;

  const schema = yup.object().shape({
    Name: yup.string().required("Tên sản phẩm không được để trống").nullable(),
  });

  const { handleSubmit, getValues, control, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Name: "",
    },
  });

  const { errors } = formState;
  const showNotifySnack = (res: any) => {
    enqueueSnackbar(
      res?.message,
      snackbarSetting((key) => closeSnackbar(key), {
        color: res?.code === SUCCESS_CODE ? "success" : "error",
      })
    );
  };

  const onSubmit = async (data: any) => {
    setValid(true);
    try {
      const res: some = await actionAddCategory({
        ...data,
        Image: imageCategory,
        ParentID: itemParent?.id,
      });
      if (res?.code === SUCCESS_CODE) {
        // const { data } = await actionGetEmployeesInfo();
        fetchData();
        setOpen(false);
        showNotifySnack(res);
      } else {
        enqueueSnackbar(
          res?.message,
          snackbarSetting((key) => closeSnackbar(key), { color: "error" })
        );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      setValid(false);
    }
  }, [open]);

  return (
    <>
      <form
        id={formid}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="none"
      >
        <ActionDialogCreate
          maxWidth="sm"
          fullWidth={true}
          setOpen={setOpen}
          setValid={setValid}
          open={open}
          loading={loading}
          formId={formid}
          titleTooltip={titleTooltip || ""}
        >
          <div className="dialog-content">
            <>
              <div>
                <Controller
                  render={({ onChange, value, ref }) => (
                    <FormControlTextField
                      value={value}
                      onChange={onChange}
                      label={<FormattedMessage id="IDS_CHAT_NAME" />}
                      formControlStyle={{ width: "100%", marginRight: 0 }}
                      inputProps={{ autoComplete: "none" }}
                      inputRef={ref}
                      errorMessage={errors.Name?.message}
                    />
                  )}
                  name="Name"
                  control={control}
                />
              </div>
            </>
            <FirebaseUploadCategory
              updateImage={(values: string) => {
                setImageCategory(values);
              }}
              imageCategory={""}
              key="keyFirebaseUploadProductCreate"
            />
          </div>
        </ActionDialogCreate>
      </form>
    </>
  );
};

export default withRouter(ActionCategoryDialogCreate);
