import React, { useEffect, useState } from "react";
import "./App.css";
import "antd/dist/antd.css";
import ReactPaginate from "react-paginate";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Pagination, Modal, Form, Input, Select } from "antd";

const { Option } = Select;

function Home() {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemPerPage = 10;
  let pageVisited = pageCount * itemPerPage;
  const totalPages = Math.ceil(users.length / itemPerPage);

  const pageChange = ({ selected }) => {
    setPageCount(selected);
  };

  useEffect(() => {
    getUsersDetails();
  }, []);

  const getUsersDetails = () => {
    fetch(
      `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  const deleteUser = (selectedUser) => {
    let userAfterDeletion = users.filter((user) => {
      return user.id !== selectedUser;
    });
    setUsers(userAfterDeletion);
  };

  const editUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // User confirmed, delete user
    const userAfterDeletion = users.filter((user) => {
      return user.id !== selectedUser;
    });
    setUsers(userAfterDeletion);
    setSelectedUser(null);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    // User canceled, do not delete user
    setSelectedUser(null);
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          name: values.name,
          email: values.email,
          role: values.role,
        };
      } else {
        return user;
      }
    });

    setUsers(updatedUsers);
    setSelectedUser(null);
    setIsModalVisible(false);
  };

  const initialValues = selectedUser
    ? {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      }
    : {};

  return (
    <div className="container">
      <br />
      <input
        type="text"
        name="name"
        placeholder="Search by any field"
        onChange={(e) => setSearchUser(e.target.value)}
      />

      <table className="table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users
            //Search Data by Input
            .filter((user) => {
              if (searchUser === "") return user;
              else if (
                user.name.includes(searchUser) ||
                user.email.includes(searchUser) ||
                user.role.includes(searchUser)
              ) {
                return user;
              }
            })
            .slice(pageVisited, pageVisited + itemPerPage)
            .map((user) => (
              <tr key={user.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="btn">
                  <button onClick={() => editUserDetails(user)}>
                    <AiFillEdit style={{ color:"white"}}/>
                  </button>
                  <button id="b" onClick={() => deleteUser(user.id)}>
                    <AiFillDelete  style={{ color:"white"}}/>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <br />
      <br />

      {/* pagination */}
      <ReactPaginate
        className="pagination"
        previousLabel={"Prev"}
        nextLabel={"Next"}
        pageCount={totalPages}
        onPageChange={pageChange}
        containerClassName={<Pagination />}
      />

      {/* modal */}
      <Modal
        title="Edit User Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={onFinish} initialValues={initialValues}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter an email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
          <Form.Item>
  <button type="submit" style={{ display: "block", margin: "0 auto", color:"white" }}>
    Save
  </button>
</Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Home;