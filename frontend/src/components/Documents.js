import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  List,
  Avatar,
  Collapse,
  Input,
  Button,
  notification,
  Modal,
  Icon
} from "antd";

import Upload from "./Upload";
import Loading from "./Loading";

import { doGet, doDelete } from "../utils/request";
import doUpload from "../utils/doUpload";
import moment from "moment";

const inputStyle = {
  maxWidth: "400px",
  marginBottom: "16px"
};

const margin = {
  marginBottom: "16px"
};

const Documents = props => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadData, setUploadData] = useState(null);
  const [documentInfo, setDocumentInfo] = useState({});

  const userType = useSelector(state => state.currentUser.userInfo.userType);

  useEffect(() => {
    fetchDocuments();
  }, [setDocuments]);

  const fetchDocuments = () => {
    setIsLoading(true);
    doGet("documents")
      .then(documents => {
        setDocuments(documents);
      })
      .catch(err => {
        notification.error({
          message: "Oops! Something went wrong!",
          description: err.message
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!error) return;
    notification.error({
      message: "Error",
      description: error
    });
  }, [error]);

  useEffect(() => {
    setDocumentInfo(
      Object.values(uploadedDocuments).reduce((documentInfo, doc) => {
        return {
          ...documentInfo,
          [doc.id]: documentInfo[doc.id] || {
            title: doc.data.name,
            description: ""
          }
        };
      }, documentInfo)
    );
  }, [uploadedDocuments]);

  const confirmDelete = (id, title) => {
    const modal = Modal.confirm({
      autoFocusButton: "cancel",
      cancelText: "Don't delete anything",
      okText: "DELETE",
      okType: "danger",
      centered: true,
      title: `Do you really want to delete ${title}?`,
      content: "This action cannot be undone",
      icon: <Icon type="exclamation-circle" style={{ fontSize: "48px" }} />,
      onCancel: () => modal.destroy(),
      onOk: () => {
        modal.destroy();
        deleteDocument(id);
      }
    });
  };

  const uploadFiles = () => {
    setIsLoading(true);

    uploadData.append("info", JSON.stringify(documentInfo));

    doUpload("documents", uploadData)
      .then(() => fetchDocuments())
      .catch(err => {
        setError(err.message);
        notification.error({
          message: "Oops! Something went wrong!",
          description: err.message
        });
      })
      .finally(() => setIsLoading(false));
  };

  const setTitle = (id, title) => {
    setDocumentInfo({
      ...documentInfo,
      [id]: { ...documentInfo[id], title }
    });
  };

  const setDescription = (id, description) => {
    setDocumentInfo({
      ...documentInfo,
      [id]: { ...documentInfo[id], description }
    });
  };

  const deleteDocument = id => {
    setIsLoading(true);
    doDelete(`documents/${id}`)
      .then(data => {
        fetchDocuments();
      })
      .catch(err => {
        notification.error({
          message: "Oops! Something went wrong!",
          description: err.message
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="Documents">
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: 0 }}>Documents</h1>
          <p>Looking for some info? Chances are you'll find it here</p>     
        </div>
        {userType === 1 ? (
          <Collapse bordered={false}>
            <Collapse.Panel header="Add new files">
              {uploadData ? (
                <List
                  style={margin}
                  itemLayout="vertical"
                  dataSource={Object.values(uploadedDocuments)}
                  renderItem={doc => {
                    const size =
                      doc.data.size < 1024
                        ? doc.data.size + " bytes"
                        : doc.data.size < 1024 * 1024
                        ? Math.round(doc.data.size / 1024) + "kb"
                        : (doc.data.size / (1024 * 1024)).toFixed(1) + "mb";

                    return (
                      <List.Item key={doc.id}>
                        <List.Item.Meta
                          title={doc.data.name}
                          description={`Size - ${size}`}
                        />

                        <p>Title</p>
                        <Input
                          value={
                            documentInfo[doc.id]
                              ? documentInfo[doc.id].title
                              : ""
                          }
                          onChange={e => setTitle(doc.id, e.target.value)}
                          placeholder="Document"
                          style={inputStyle}
                        />

                        <p>Description</p>
                        <Input.TextArea
                          autosize={true}
                          style={{ ...inputStyle, resize: "none" }}
                          value={
                            documentInfo[doc.id]
                              ? documentInfo[doc.id].description
                              : ""
                          }
                          onChange={e => setDescription(doc.id, e.target.value)}
                          placeholder="Describe the contents of this document"
                        />
                      </List.Item>
                    );
                  }}
                />
              ) : null}
              <Upload
                handleUploadedFiles={setUploadedDocuments}
                handleFormData={setUploadData}
                multiple={true}
                style={margin}
              />
              {uploadData && (
                <Button style={margin} type="primary" onClick={uploadFiles}>
                  Confirm upload
                </Button>
              )}
            </Collapse.Panel>
          </Collapse>
        ) : null}

        <List
          itemLayout="vertical"
          locale={{ emptyText: "Right now there are no documents to show" }}
          size="large"
          dataSource={documents}
          renderItem={doc => {
            const size =
              doc.size < 1024
                ? "a few bytes"
                : doc.size < 1024 * 1024
                ? Math.round(doc.size / 1024) + "kb"
                : (doc.size / (1024 * 1024)).toFixed(1) + "mb";
            const date = moment(doc.createdAt).format("DD-MM-YYYY");
            const uploader = doc.uploader || { name: "removed user" };

            return (
              <List.Item
                key={doc._id}
                actions={[
                  <a href={doc.src} target="_blank" download>
                    {" "}
                    download{" "}
                  </a>,
                  userType === 1 ? (
                    <a
                      style={{ color: "red" }}
                      onClick={() => confirmDelete(doc._id, doc.title)}
                    >
                      {" "}
                      delete{" "}
                    </a>
                  ) : null
                ]}
              >
                <List.Item.Meta
                  title={doc.title}
                  description={`Uploaded by ${uploader.name} on ${date}. Size - ${size}`}
                  avatar={<Avatar icon="file-text" />}
                />
                <div>{doc.description}</div>
              </List.Item>
            );
          }}
        />
      </div>
    </Loading>
  );
};

export default Documents;
