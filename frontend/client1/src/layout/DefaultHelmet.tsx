import { Avatar, Container, Paper, Popper } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import JSONbig from 'json-bigint';
import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  ACCESS_TOKEN,
  ACCOUNTS,
  ACCOUNTS_ID,
  CART_LOCAL_STORAGE,
  some,
  SUCCESS_CODE,
} from '../constants/constants';
import { routes } from '../constants/routes';
import { ProductCount } from '../models/object';
import { Col, Row } from '../modules/common/Elements';
import SearchBox from '../modules/profile/component/SearchBox';
import { actionGetAllProduct } from '../modules/system/systemAction';
interface Props {
  readonly profile?: some;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
    },
    grow: {
      // flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    large: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  })
);
const DefaultHelmet: React.FC<RouteComponentProps<any> & Props> = (props) => {
  // const { profile } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [data, setData] = React.useState<any>();
  const [userProfile, setUserProfile] = React.useState<some>(
    JSONbig.parse(localStorage.getItem(ACCOUNTS) || '{}')
  );
  const [anchorElMenu, setAnchorElMenu] = React.useState<HTMLElement | null>(
    null
  );
  const open = Boolean(anchorElMenu);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl,
  ] = React.useState<null | HTMLElement>(null);
  const [islogin, setLogin] = React.useState(
    userProfile?.userName !== undefined
  );
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { countProduct, setCountProduct } = React.useContext(ProductCount) as {
    countProduct: number;
    setCountProduct: React.Dispatch<React.SetStateAction<number>>;
  };

  useEffect(() => {
    setLogin(userProfile?.userName !== undefined); // eslint-disable-next-line
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorElMenu(null);
  };
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const fetchListCategory = async () => {
    try {
      const res: some = await actionGetAllProduct();
      if (res?.code === SUCCESS_CODE) {
        setData(res);
      } else {
      }
    } catch (error) {}
  };
  React.useEffect(() => {
    fetchListCategory();
  }, []);
  const reset = () => {
    setUserProfile({});
    setAnchorEl(null);
    setAnchorElMenu(null);
    setLogin(false);
    setCountProduct(0);
  };

  const handleMenuLogin = (route: string) => props?.history?.push(route);
  const handleMenuLogout = (route: string) => {
    reset();
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ACCOUNTS);
    localStorage.removeItem(ACCOUNTS_ID);
    localStorage.removeItem(CART_LOCAL_STORAGE);
    props?.history?.push(route);
  };
  const gotoDetailCategory = (id: number) => {
    props?.history?.push(`/detail-category/${id}`);
  };

  const gotoCart = (route: string) => props?.history?.push(route);
  const gotoProfile = (route: string) => {
    props?.history?.push(`/customer`);
  };
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {islogin && (
        <MenuItem
          onClick={() => {
            gotoProfile(routes.CUSTOMER);
            handleMenuClose();
          }}
        >
          Thông tin tài khoản
        </MenuItem>
      )}
      {islogin ? (
        <MenuItem
          onClick={() => {
            handleMenuLogout(routes.HOME);
          }}
        >
          Đăng xuất
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => {
            handleMenuLogin(routes.LOGIN);
          }}
        >
          Đăng nhập
        </MenuItem>
      )}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {islogin && (
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <Typography>Thông tin tài khoản</Typography>
        </MenuItem>
      )}

      <MenuItem
        onClick={() => {
          gotoCart(routes.PRODUCT_CART);
        }}
      >
        <IconButton color="inherit">
          <ShoppingCartIcon style={{ marginRight: 10 }} />
          <Typography>Giỏ hàng</Typography>
        </IconButton>
      </MenuItem>
    </Menu>
  );
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Row
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <Typography
                className={classes.title}
                variant="h5"
                noWrap
                style={{
                  marginRight: 10,
                  width: 150,
                  cursor: 'pointer',
                  color: 'white',
                }}
                onClick={() => {
                  props?.history?.push(`/`);
                }}
              >
                TIKO DUT
              </Typography>
              <Row style={{ width: 150 }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  aria-owns={open ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  // onClick={handleClickAgent}
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                  style={{ borderRadius: 0 }}
                >
                  <Row>
                    <MenuIcon fontSize="large" />
                    <Col>
                      <Typography
                        style={{
                          fontSize: 14,
                          paddingTop: 10,
                          textAlign: 'left',
                        }}
                        variant="body2"
                      >
                        Danh Mục
                      </Typography>
                      <Typography
                        style={{
                          fontSize: 14,
                          paddingBottom: 10,
                          fontWeight: 'bold',
                        }}
                        variant="body2"
                      >
                        Sản Phẩm
                      </Typography>
                    </Col>
                    <Popper
                      style={{ zIndex: 4 }}
                      id="mouse-over-popover"
                      open={open}
                      anchorEl={anchorElMenu}
                      placement="top-start"
                      disablePortal={true}
                      modifiers={{
                        flip: {
                          enabled: true,
                        },
                        preventOverflow: {
                          enabled: true,
                          boundariesElement: 'scrollParent',
                        },
                      }}
                    >
                      <Paper onMouseLeave={handlePopoverClose}>
                        {data !== undefined &&
                          data.message.childList.map(
                            (items: some, index: number) => {
                              return (
                                <MenuItem
                                  key={index}
                                  onClick={() => {
                                    gotoDetailCategory(items.id);
                                    handlePopoverClose();
                                  }}
                                >
                                  {items?.name}
                                </MenuItem>
                              );
                            }
                          )}
                      </Paper>
                    </Popper>
                  </Row>
                </IconButton>
              </Row>
            </Row>
            <Row
              style={{
                flex: 2,
                display: 'flex',
              }}
            >
              <SearchBox />
            </Row>
            <Row
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <Row style={{ width: 150 }}>
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    style={{ borderRadius: 0 }}
                  >
                    <Row>
                      <Avatar
                        alt="Remy Sharp"
                        src="https://scontent.fhan2-5.fna.fbcdn.net/v/t1.6435-9/153745673_1997564207066819_2723027247060726863_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=A5IMouMiviEAX-qd3fr&_nc_ht=scontent.fhan2-5.fna&oh=732a6d84a3ae1cb3d41924496738ebd6&oe=608C0150"
                        className={classes.large}
                      />
                      <Col>
                        <Typography
                          style={{
                            fontSize: 14,
                            paddingTop: 10,
                            textAlign: 'left',
                          }}
                          variant="body2"
                        >
                          Tài khoản
                        </Typography>
                        <Typography
                          style={{ fontSize: 14, paddingBottom: 10 }}
                          variant="body2"
                        >
                          {userProfile?.userName}
                        </Typography>
                      </Col>
                    </Row>
                  </IconButton>
                </Row>
              </div>
              <div
                className={classes.sectionDesktop}
                style={{ position: 'relative' }}
              >
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  color="inherit"
                  onClick={() => {
                    gotoCart(routes.PRODUCT_CART);
                  }}
                  style={{ borderRadius: 0 }}
                >
                  <Row>
                    <ShoppingCartIcon fontSize="large" />
                    <Typography style={{ fontSize: 14, paddingTop: 12 }}>
                      Giỏ hàng
                    </Typography>
                  </Row>
                  <div
                    style={{
                      backgroundColor: 'orange',
                      width: 25,
                      height: 25,
                      borderRadius: "50%",
                      position: 'absolute',
                      top: 0,
                      marginLeft: -15,
                    }}
                  >
                    <Typography style={{ fontSize: '13px', marginTop:2 }}>
                      {countProduct}
                    </Typography>
                  </div>
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>
            </Row>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default withRouter(DefaultHelmet);
