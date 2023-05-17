import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { USER_ROLE } from "../../../../constants/constants";
import { AppState } from "../../../rootReducer";
import HeaderManagement from "../../components/HeaderManagement";
import "../../Management.scss";
import Category from "../components/Category";

function mapStateToProps(state: AppState) {
  return {
    profile: state.system.profile,
  };
}
interface Props extends ReturnType<typeof mapStateToProps> {}
const ManagerCategory: React.FC<RouteComponentProps<any> & Props> = (props) => {
  const { profile } = props;
  const adminRole = localStorage.getItem(USER_ROLE)?.indexOf("Admin") !== -1;
  const history = useHistory();

  return (
    <div className="management-container">
      <HeaderManagement fetchData={() => console.log("")} />
      <Category openCategory={true} handleClickCategory={(name: string, id: string) => console.log("saddas",name)} />
    </div>
  );
};

export default connect(mapStateToProps)(withRouter(ManagerCategory));
