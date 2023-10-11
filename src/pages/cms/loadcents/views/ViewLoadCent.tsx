import {
  Card,
  Button,
  Table,
  Alert,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Select,
  Tooltip,
} from "antd";
import "../styles/view-loadcent.scss";
import type { ColumnsType } from "antd/es/table";
import {
  createLoadCent,
  deleteLoadCent,
  getLoadCent,
  updateLoadCent,
} from "../api";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EditOutlined } from "@ant-design/icons";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";

interface DataType {
  id: number;
  value: number;
  coins: number;
  bonus: number;
}

const ViewLoadCent: React.FC = () => {
  const [dataLoadCent, setDataLoadCent] = useState<any>();
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState("");
  const [idLoadCent, setIdLoadCent] = useState<any>();

  const [form] = Form.useForm();
  const params = useParams();

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render(value, record, index) {
        return <a>{index + 1}</a>;
      },
    },

    {
      title: "Giá trị(k)",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Số xu tương đương",
      dataIndex: "coins",
      key: "coins",
    },
    {
      title: "Cộng thêm",
      dataIndex: "bonus",
      key: "bonus",
    },
    {
      title: "Action",
      key: "action",
      render: (value) => (
        <>
          <Tooltip title="Sửa Nạp xu" color={"blue"}>
            <Button
              size="middle"
              type="primary"
              style={{ marginRight: "5px" }}
              onClick={() => showModal(value)}
            >
              <EditOutlined rev={undefined} />
            </Button>
          </Tooltip>
          <Tooltip title="Xóa Nạp xu" color={"red"}>
            <Button
              size="middle"
              type="primary"
              danger
              onClick={() => {
                if (
                  // eslint-disable-next-line no-restricted-globals
                  confirm(`Bạn có muốn xóa cách nạp xu này không`) === true
                ) {
                  destroyLoadCent(value.id);
                }
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    getLoadCent(params.id_bankinfo)
      .then((res: any) => {
        setDataLoadCent(res.data.load_cent);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (alert) {
      var a = setTimeout(() => {
        setAlert("");
      }, 3000);
    }
    return () => clearTimeout(a);
  }, [alert]);

  const showModal = (value: any) => {
    setOpen(true);
    if (value) {
      form.setFieldsValue({
        coins: value.coins,
        bonus: value.bonus,
        value: value.value,
      });
      setIdLoadCent(value.id);
    }
  };

  const handleOk = () => {
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setIdLoadCent("");
  };

  // Thêm mới LoadCent
  const postLoadCent = async (values: any) => {
    await createLoadCent(params.id_bankinfo, values)
      .then((res: any) => {
        setAlert(res.data.message);
        handleCancel();
        getLoadCent(params.id_bankinfo).then((res: any) => {
          setDataLoadCent(res.data.load_cent);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Cập nhật LoadCent
  const changeLoadCent = async (values: any) => {
    await updateLoadCent(idLoadCent, values)
      .then((res) => {
        setAlert(res.data.message);
        handleCancel();
        getLoadCent(params.id_bankinfo).then((res: any) => {
          setDataLoadCent(res.data.load_cent);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Xóa LoadCent
  const destroyLoadCent = async (id: number) => {
    await deleteLoadCent(id)
      .then((res) => {
        setAlert(res.data.message);
        getLoadCent(params.id_bankinfo).then((res: any) => {
          setDataLoadCent(res.data.load_cent);
        });
      })
      .catch((err) => console.log(err));
  };

  const saveLoadCent = (values: any) => {
    if (!idLoadCent) {
      postLoadCent(values);
    } else {
      values.id = idLoadCent;
      changeLoadCent(values);
    }
  };

  return (
    <>
      <div className="top-main">
        <p>Danh sách Nạp xu</p>
        <div className="top-main__right">
          <a href="">Nạp xu</a> / <span>Danh sách Nạp xu</span>
        </div>
      </div>
      <Card>
        <Tooltip title="Thêm mới Nạp xu" color={"blue"}>
          <Button
            type="primary"
            onClick={() => showModal("")}
            style={{ marginBottom: "20px" }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Tooltip>
        {alert && (
          <Alert
            message={alert}
            type="success"
            closable
            style={{ marginBottom: "20px", fontSize: "24px" }}
          />
        )}

        <Modal
          title={`${idLoadCent ? "Sửa Nạp xu" : "Thêm mới Nạp xu"}`}
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form
            name="wrap"
            labelCol={{ flex: "110px" }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
            style={{ maxWidth: 600 }}
            form={form}
            onFinish={saveLoadCent}
          >
            <Form.Item
              label="Giá trị"
              name="value"
              rules={[
                {
                  required: true,
                  message: "Giá trị không được bỏ trống",
                },
              ]}
            >
              <Input type="number" name="value" />
            </Form.Item>

            <Form.Item
              label="Số xu tương đương"
              name="coins"
              rules={[
                {
                  required: true,
                  message: "Số xu tương đương không được bỏ trống",
                },
              ]}
            >
              <Input type="number" name="coins" />
            </Form.Item>

            <Form.Item label="Cộng thêm" name="bonus">
              <Input type="number" name="bonus" />
            </Form.Item>

            <div className="submit-button">
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: "10px" }}
              >
                Lưu
              </Button>
              <Button type="primary" danger onClick={handleCancel}>
                Hủy
              </Button>
            </div>
          </Form>
        </Modal>

        <Table
          columns={columns}
          dataSource={dataLoadCent}
          rowKey={(record) => record.id}
          scroll={{ x: 0 }}
        />
      </Card>
    </>
  );
};

export default ViewLoadCent;
