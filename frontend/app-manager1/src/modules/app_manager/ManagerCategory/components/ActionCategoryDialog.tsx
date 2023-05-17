import { yupResolver } from "@hookform/resolvers/yup";
import JSONbig from "json-bigint";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router-dom";
import * as yup from "yup";
import { some, SUCCESS_CODE } from "../../../../constants/constants";
import { snackbarSetting } from "../../../common/Elements";
import FormControlTextField from "../../../common/FormControlTextField";
import ActionDialog from "../../components/ActionDialog";
import FirebaseUploadCategory from "../../firebaseupload/FirebaseUploadCategory";
import {
  actionUpdateCategory
} from "../../managerAction";

interface Props {
  item?: some;
  fetchData: () => void;
  isCategory: boolean;
}

const ActionCategoryDialog: React.FC<RouteComponentProps<any> & Props> = (
  props
) => {
  const { item, fetchData, isCategory } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [imageCategory, setImageCategory] = React.useState<string>(item?.image || "");
  const [valid, setValid] = useState<boolean>(false);
  
  const schema = yup.object().shape({
    Name: yup.string().required("Tên sản phẩm không được để trống").nullable(),
  });

  const { handleSubmit, getValues, control, formState, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Name: item?.name,
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
    if ( imageCategory === "") {
      enqueueSnackbar(
        "Bạn cần thêm hình ảnh cho danh mục",
        snackbarSetting((key) => closeSnackbar(key), { color: "error" })
      );
      return;
    }
    try {
      setLoading(true);
      const res: some = await actionUpdateCategory({
        ...data,
        Image: imageCategory,
        ID:item?.id,
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

  return (
    <>
      <form
        id={item?.id || "formCategoryDialog"}
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="none"
      >
        <ActionDialog
          maxWidth="sm"
          fullWidth={true}
          setOpen={setOpen}
          setValid={setValid}
          open={open}
          loading={loading}
          formId={item?.id || "formCategoryDialog"}
          item={item || []}
          category={isCategory}
        >
          <div className="dialog-content">
            <>
              <Controller
                name="product"
                control={control}
                render={() => (
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
                )}
              />
              <FirebaseUploadCategory
                updateImage={(values: string) => {
                  setImageCategory(values);
                }}
                imageCategory={item?.image}
                key="keyFirebaseUploadProductCreate"
              />
            </>
          </div>
        </ActionDialog>
      </form>
    </>
  );
};

export default withRouter(ActionCategoryDialog);
