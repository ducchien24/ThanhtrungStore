import { Box, Button, IconButton, Typography } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import ClearIcon from "@material-ui/icons/Clear";
import PublishIcon from "@material-ui/icons/Publish";
import React, { useState } from "react";
import { some } from "../../../constants/constants";
import { storage } from "../../../firebase";
import { Col, Row } from "../../common/Elements";

interface Props {
  // fetchData: () => void;
  updateImage(values: string): void;
  imageCategory: string;
}

const FirebaseUploadCategory: React.FC<Props> = (props) => {
  const { updateImage, imageCategory } = props;
  const [image, setImage] = useState<any>(null);
  const [url, setUrl] = useState(imageCategory);
  const [progress, setProgress] = useState(0);

  const handleChange = (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = (image: any) => {
    if (image) {
      const uploadTask = storage.ref(`images/${image?.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              setUrl(url);
              updateImage(url);
            });
        }
      );
    }
  };

  const deleteImage = () => {
    setUrl("");
  };

  return (
    <Col
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Row
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems:"center" }}
      >
        <Box>
            <Typography variant="body2" >
              Thêm hình danh mục (bắt buộc)
            </Typography>
          </Box>
        <Button
          style={{ width: 100 }}
          variant="contained"
          color="secondary"
          component="label"
          startIcon={<PublishIcon />}
        >
          Thêm
          <input type="file" hidden onChange={handleChange} />
        </Button>
      </Row>

      <Col>
        <>
          <LinearProgress
            variant="determinate"
            value={progress}
            valueBuffer={100}
            style={{
              width: 200,
              display: "flex",
              marginTop: 10,
            }}
          />

          <Box style={{ position: "relative" }}>
            <img
              style={{
                width: 200,
                height: 200,
                marginRight: 10,
                marginBottom: 10,
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 5,
              }}
              src={url || "https://freshcorner.com.vn/wp-content/uploads/2021/01/empty.jpg"}
              alt="No image"
            />
            <IconButton
              style={{
                position: "absolute",
                marginLeft: -50,
                marginTop: -7,
                color: "orange",
              }}
              onClick={() => deleteImage()}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        </>
      </Col>
    </Col>
  );
};

export default FirebaseUploadCategory;
