import { TreeItem, TreeView } from "@material-ui/lab";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { some, SUCCESS_CODE } from "../../../../constants/constants";
import {
  actionGetAllProduct,
  actionGetCategoryAllChildList,
} from "../../managerAction";
import { Box, CircularProgress, Tooltip, Typography } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { Row } from "../../../common/Elements";
import TableCustom from "../../../common/TableCustom";
import { GREY_600 } from "../../../../assets/theme/colors";
import ActionCategoryDialog from "./ActionCategoryDialog";
import DeleteDialog from "../../components/DeleteDialog";
import ActionCategoryDialogCreate from "./ActionCategoryDialogCreate";
interface Props {
  openCategory: boolean;
  handleClickCategory(name: string, id: string): void;
}

interface RenderTree {
  id: string;
  name: string;
  image: string;
  childList?: RenderTree[];
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    padding: 20,
  },
});
const Category: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { openCategory, handleClickCategory } = props;
  const [categoryID, setCategoryID] = React.useState<string>("");
  const [listCategory, setListCatergory] = React.useState<some>([]);
  const [listChildCategory, setListChildCatergory] = React.useState<some[]>([]);
  const [loadding, setLoadding] = React.useState<boolean>(false);
  const [category, setCategory] = React.useState<any>({
    name: "",
    id: null,
    image: "",
  });
  const emptyCategory = {
    name: "",
    id: null,
    image: "",
  };

  const fetchAllCategory = async () => {
    try {
      const res: some = await actionGetCategoryAllChildList({});
      if (res?.code === SUCCESS_CODE) {
        setListCatergory(res?.category.childList);
        if (categoryID === "") {
          setCategoryID(res?.category.childList[0].id);
          setCategory({
            name: res?.category.childList[0].name,
            id: res?.category.childList[0].id,
            image: res?.category.childList[0].image,
          });
        }
      } else {
        // none
      }
    } catch (error) {
    } finally {
      setLoadding(true);
    }
  };

  const fetchAllCategoryChild = async () => {
    try {
      const res: some = await actionGetAllProduct({
        ParentID: category.id,
      });
      if (res?.code === SUCCESS_CODE) {
        setListChildCatergory(res?.message.childList);
      } else {
        // none
      }
    } catch (error) {
    } finally {
      setLoadding(true);
    }
  };

  React.useEffect(() => {
    fetchAllCategory();
  }, []);

  React.useEffect(() => {
    category.id && fetchAllCategoryChild();
  }, [category, listCategory]);

  const columns = [
    {
      width: 50,
      styleHeader: { color: GREY_600 },
      dataIndex: "name",
      render: (record: any) => {
        return (
          <Row>
            <img
              style={{ width: "100%" }}
              src={
                record?.image ||
                "https://www.événementiel.net/wp-content/uploads/2014/02/default-placeholder.png"
              }
              alt={record?.name}
            />
          </Row>
        );
      },
    },
    {
      title: "IDS_CHAT_NAME",
      dataIndex: "name",
      styleHeader: { color: GREY_600 },
      render: (record: any) => {
        return (
          <p
            // variant="inherit"
            style={{
              width: 150,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {record?.name}
          </p>
        );
      },
    },
    {
      title: "IDS_CHAT_ACTION",
      dataIndex: "id",
      width: 300,
      styleHeader: { color: GREY_600, textAlign: "center" },
      render: (record: any) => {
        return (
          <Row className="action-container" key={record?.id}>
            <ActionCategoryDialog
              item={record}
              fetchData={fetchAllCategoryChild}
              isCategory={false}
            />
            <DeleteDialog item={record} fetchData={fetchAllCategory} />
          </Row>
        );
      },
    },
  ];

  const renderTree = (nodes: RenderTree) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <div
          style={{
            marginBottom: 5,
          }}
        >
          <Row>
            {nodes.id === category.id ? (
              <FolderIcon color="inherit" />
            ) : (
              <FolderOpenIcon color="inherit" />
            )}
            <Typography
              color="inherit"
              style={{
                fontSize: 18,
              }}
            >
              {nodes.name}
            </Typography>
          </Row>
        </div>
      }
      onClick={() => {
        if (nodes.childList?.length === 0) {
          handleClickCategory(nodes.name, nodes.id);
        }
        setCategory({ name: nodes.name, id: nodes.id, image: nodes.image });
        setCategoryID(nodes.id);
      }}
    >
      {Array.isArray(nodes.childList)
        ? nodes.childList.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <>
      {!loadding ? (
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
      ) : (
        <Row>
          <Box
            style={{
              flex: 1,
              height: 550,
              overflow: "scroll",
              backgroundColor: "white",
              borderRadius: 5,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#ebebeb",
              marginRight: 10,
            }}
          >
            <Row
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <Typography color="inherit" variant="h5" style={{}}>
                Danh mục
              </Typography>
              <ActionCategoryDialogCreate
                fetchData={fetchAllCategory}
                itemParent={emptyCategory}
                titleTooltip="Thêm danh mục gốc"
              />
            </Row>

            {!loadding && (
              <Box
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <TreeView
              defaultExpanded={[categoryID]}
              selected={[categoryID]}
              className={classes.root}
              defaultCollapseIcon={
                <ArrowRightIcon
                  style={{
                    marginBottom: 5,
                  }}
                />
              }
              defaultExpandIcon={
                <ArrowDropDownIcon
                  style={{
                    marginBottom: 5,
                  }}
                />
              }
            >
              {listCategory &&
                listCategory.map((node: any) => renderTree(node))}
            </TreeView>
          </Box>
          <Box
            style={{
              flex: 3,
              height: 550,
              overflow: "scroll",
              backgroundColor: "white",
              borderRadius: 5,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#ebebeb",
            }}
          >
            {loadding && (
              <>
                <Row key={categoryID}>
                  <Typography
                    color="inherit"
                    variant="h5"
                    style={{
                      flex: 14,
                      paddingTop: 20,
                      paddingLeft: 20,
                      paddingBottom: 20,
                    }}
                  >
                    {category.name}
                  </Typography>
                  <Box style={{ flex: 1 }}>
                    <ActionCategoryDialog
                      item={category}
                      fetchData={fetchAllCategoryChild}
                      isCategory={true}
                    />
                  </Box>

                  <Box style={{ flex: 1 }}>
                    <ActionCategoryDialogCreate
                      fetchData={fetchAllCategory}
                      itemParent={category}
                      titleTooltip="Thêm danh mục con"
                    />
                  </Box>

                  <Box style={{ flex: 1 }}>
                    <DeleteDialog
                      item={category}
                      fetchData={fetchAllCategory}
                      category={true}
                    />
                  </Box>
                </Row>

                <Box style={{ paddingBottom: 20 }}>
                  <TableCustom
                    dataSource={listChildCategory || []}
                    columns={columns}
                    noColumnIndex
                  />
                </Box>
              </>
            )}
          </Box>
        </Row>
      )}
    </>
  );
};
export default Category;
