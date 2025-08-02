import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Table,
  Button,
  Tag,
  DatePicker,
  Select,
  Input,
  Modal,
  Descriptions,
  Drawer,
} from "antd";
import {
  ReloadOutlined,
  DownloadOutlined,
  EyeOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { AuthContext } from "./context/AuthContext";
// import { API_ENDPOINTS } from "./apiConfig"; // ❌ Temporarily disabled

// ✅ Temporary fallback for API endpoint
const API_ENDPOINTS = {
  bookings: {
    all: "/api/bookings/all",
  },
};

import * as XLSX from "xlsx";
import "./AdminDashboard.css";

const AdminSidebar = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(API_ENDPOINTS.bookings.all, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Session expired or unauthorized. Please login again."
          );
        }
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data);
      setFilteredBookings(data);
      setError("");
    } catch (err) {
      setError(err.message || "Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = useCallback(() => {
    let filtered = [...bookings];
    if (filterDate) {
      const selected = filterDate.startOf("day");
      filtered = filtered.filter((booking) =>
        selected.isSame(booking.date, "day")
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter((booking) =>
        booking.customer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBookings(filtered);
  }, [bookings, filterDate, statusFilter, searchTerm]);

  useEffect(() => {
    if (isAuthenticated) fetchBookings();
  }, [isAuthenticated]);

  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "bookings.xlsx");
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "confirmed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => setSelectedBooking(record)}
        >
          View
        </Button>
      ),
    },
  ];

  const sidebarContent = (
    <>
      <div className="sidebar-header">
        <h2>{!collapsed ? "Bookings" : "B"}</h2>
        {!isMobile && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapse}
            className="collapse-btn"
          />
        )}
      </div>

      <div className="sidebar-content">
        <div className="filters">
          {!collapsed && (
            <>
              <DatePicker
                onChange={(date) => setFilterDate(date)}
                placeholder="Filter by date"
                style={{ width: "100%", marginBottom: 10 }}
              />
              <Select
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                style={{ width: "100%", marginBottom: 10 }}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "pending", label: "Pending" },
                  { value: "confirmed", label: "Confirmed" },
                ]}
              />
              <Input
                placeholder="Search by customer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "100%", marginBottom: 10 }}
                allowClear
              />
            </>
          )}
          <div className="sidebar-buttons">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchBookings}
              block
              style={{ marginBottom: 10 }}
            >
              {!collapsed && "Refresh"}
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={exportToExcel}
              type="primary"
              block
            >
              {!collapsed && "Export"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="error-container">
            <p className="error-message">
              {error.toLowerCase().includes("token") ||
              error.toLowerCase().includes("unauthorized") ||
              error.toLowerCase().includes("login") ? (
                <>
                  {error} — <a href="/login">Please login again</a>
                </>
              ) : (
                error
              )}
            </p>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <Table
            dataSource={filteredBookings}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
            size="small"
            className="sidebar-table"
          />
        )}
      </div>
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={() => setVisible(true)}
            style={{ position: "fixed", top: 16, left: 16, zIndex: 1000 }}
          />
          <Drawer
            title="Bookings Panel"
            placement="left"
            onClose={() => setVisible(false)}
            visible={visible}
            width={300}
            bodyStyle={{ padding: 0 }}
          >
            {sidebarContent}
          </Drawer>
        </>
      ) : (
        <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
          {sidebarContent}
        </div>
      )}

      <Modal
        {...(Modal.hasOwnProperty("open")
          ? { open: !!selectedBooking }
          : { visible: !!selectedBooking })}
        onCancel={() => setSelectedBooking(null)}
        footer={null}
        title="Booking Details"
      >
        {selectedBooking && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Customer">
              {selectedBooking.customer}
            </Descriptions.Item>
            <Descriptions.Item label="Room">
              {selectedBooking.room}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {selectedBooking.date}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedBooking.status === "confirmed" ? "green" : "orange"
                }
              >
                {selectedBooking.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default AdminSidebar;
