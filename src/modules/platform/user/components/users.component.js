import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";

import Table from "../../../core/components/table.component";
import Pagination from "../../../core/components/pagination.component";
import { Link } from "react-router-dom";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { getUsers, deleteUser, getUser } from "../user.actions";
import { getPermission } from "../../permission/permission.actions";
import Dropdown from "react-bootstrap/Dropdown";
import { toast } from "react-toastify";
import UpdateUser from "./updateUser.component";

const Users = (props) => {
    const { path } = useRouteMatch();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    const pageCount = 2;
    const [sortColumn, setSortColumn] = useState({
        path: "first_name",
        order: "asc",
    });

    const [activePage, setActivePage] = useState(1);
    const [needToFetchUser, setNeedToFetchUser] = useState(true);
    const [detailsModal, setDetailsModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [userPermissions, setUserPermissions] = useState([]);
    const [showPermission, setShowPermission] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deletedUserId, setDeletedUserId] = useState("1");
    const [updateUserId, setUpdateUserId] = useState();

    const modalStyle = {
        content: {
            top: "30%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundFilter: "blur(2px)",
            border: "1px solid black",
        },
        overlay: { zIndex: 1000 },
    };

    const columns = [
        {
            label: "Profile ID",
            path: "profile_id",
            sorting: true,
            content: (profile, detail) => <td>{profile[detail]}</td>,
        },
        {
            label: "First Name",
            path: "first_name",
            sorting: true,
            content: (profile, detail) => <td>{profile[detail]}</td>,
        },
        {
            label: "Last Name",
            path: "last_name",
            sorting: true,
            content: (profile, detail) => <td>{profile[detail]}</td>,
        },
        {
            label: "Email",
            path: "email",
            sorting: true,
            content: (profile, detail) => <td>{profile[detail]}</td>,
        },
        {
            label: "Phone No.",
            path: "phone",
            content: (profile, detail) => <td>{profile[detail]}</td>,
        },
        {
            label: "Actions",
            content: (profile, detail) => (
                <td>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="secondary"
                            id="dropdown-basic"
                        >
                            <i className="bi bi-pencil-square"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={() => handleUpdateModal(profile.id)}
                            >
                                Update
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => {
                                    setDeletedUserId(profile.id);
                                    setDeleteModal(true);
                                }}
                            >
                                Delete
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => handleShowDetails(profile.id)}
                            >
                                Details
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
            ),
        },
    ];

    const users = useSelector((state) => state.userReducer.userData.users);
    const userMetaData = useSelector(
        (state) => state.userReducer.userData.metaData
    );

    users?.map((user) => {
        if (user.phone === null) user.phone = "--";
    });

    const page = userMetaData?.page;
    const limit = userMetaData?.limit;
    const total = userMetaData?.total;

    const handleSort = (sortColumn) => {
        setSortColumn(sortColumn);
        const queryParams = `/?page=${activePage}&limit=${pageCount}&orderBy=${sortColumn.path}&orderType=${sortColumn.order}`;
        history.push(location.pathname + queryParams || ``);
    }

    const handleClickPage = (activePage) => {
        setActivePage(activePage);
        const queryParams = `/?page=${activePage}&limit=${pageCount}&orderBy=${sortColumn.path}&orderType=${sortColumn.order}`;
        history.push(location.pathname + queryParams || ``);
    }
    const handleShowDetails = (id) => {
        setDetailsModal(true);
        try {
            getUser(id).then((res) => setUserDetails(res.data));
        } catch (err) {
            console.log("err getting user");
        }
    };
    const handleUpdateModal = (id) => {
        setUpdateModal(true);
        try {
            setUpdateUserId(id);
            console.log("uuuupppppppppp");
        } catch (err) {
            console.log("err updating");
        }
        toggleNeedToFecthUsers();
    };

    const handleUserPermission = (id) => {
        try {
            getPermission(id).then((res) => {
                setUserPermissions(res.data.permission_services);
            });
        } catch (err) {
            console.log("err getting user permission");
        }
    };

    const toggleNeedToFecthUsers = () => {
        setNeedToFetchUser(!needToFetchUser);
    };

    async function handleDeleteUser() {
        try {
            deleteUser(deletedUserId);
            toast.success(`Successfully deleted`);
            setNeedToFetchUser(!needToFetchUser);
        } catch (error) {
            alert(`Could not delete User ${deletedUserId}`);
        }
    }

    useEffect(() => {
        dispatch(getUsers(activePage,pageCount,sortColumn.path,sortColumn.order));
    }, [needToFetchUser, location]);

    return (
        <div className="container">
            {users ? (
                <>
                    <Modal
                        isOpen={detailsModal}
                        style={modalStyle}
                        contentLabel="Details Modal"
                    >
                        <button onClick={() => setDetailsModal(false)}>
                            close
                        </button>
                        <div>
                            <ul>
                                {
                                    <>
                                        <li>ID: {userDetails.id}</li>
                                        <li>
                                            First Name: {userDetails.first_name}
                                        </li>
                                        <li>
                                            Last Name: {userDetails.last_name}
                                        </li>
                                        <li>Email: {userDetails.email}</li>
                                        <li>Phone No: {userDetails.phone}</li>
                                        <li>
                                            Profile Slug:{" "}
                                            {userDetails.profile_id}
                                        </li>
                                    </>
                                }
                            </ul>
                            <div>
                                <button
                                    onClick={() => {
                                        handleUserPermission(
                                            userDetails.profile
                                                .profile_permissions[0]
                                                .permission_id
                                        );
                                        setShowPermission(!showPermission);
                                    }}
                                >
                                    {showPermission === false
                                        ? "Show Permissions"
                                        : "Close"}
                                </button>
                                {showPermission === true ? (
                                    <ul>
                                        {userPermissions.map((permission) => {
                                            return (
                                                <li key={permission.service.id}>
                                                    {permission.service.title}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : null}
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={updateModal}
                        // style={modalStyle}
                        contentLabel="Update Modal"
                    >
                        <button
                            onClick={() => setUpdateModal(false)}
                            style={{ margin: "20px", marginLeft: "85%" }}
                        >
                            close
                        </button>
                        <UpdateUser
                            id={updateUserId}
                            setUpdateModal={setUpdateModal}
                            toggleNeedToFecthUsers={toggleNeedToFecthUsers}
                        />
                    </Modal>
                    <Modal
                        isOpen={deleteModal}
                        style={modalStyle}
                        contentLabel="Details Modal"
                    >
                        <div>
                            <i class="fa-solid fa-circle-xmark"></i>
                            <p>Are you sure you want to delete this user?</p>
                            <button
                                type="button"
                                class="btn btn-warning"
                                onClick={() => {
                                    handleDeleteUser();
                                    setDeleteModal(false);
                                }}
                                style={{ marginRight: "10px" }}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                class="btn btn-secondary"
                                onClick={() => setDeleteModal(false)}
                            >
                                No
                            </button>
                        </div>
                    </Modal>

                    <div style={{display: "flex",justifyContent: "space-between"}}>
                        <div></div>
                        <Link
                            to="/platform/users/create"
                            className="btn btn-primary m-2"
                        >
                            Create User{" "}
                        </Link>
                    </div>

                    <Table
                        users={users}
                        columns={columns}
                        sortColumns={sortColumn}
                        onSort={handleSort}
                    />
                    {updateModal ? null : (
                        <Pagination
                            totalUsers={total}
                            pageCount={pageCount}
                            activePage={activePage}
                            onClickPage={handleClickPage}
                        />
                    )}
                </>
            ) : null}{" "}
        </div>
    );
};

export default Users;
