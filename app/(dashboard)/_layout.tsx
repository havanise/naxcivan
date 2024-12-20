import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import Pagination from "@cherry-soft/react-native-basic-pagination";
import * as Notifications from "expo-notifications";
import { Table, Row } from "react-native-reanimated-table";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import moment from "moment";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TenantContext, AuthContext } from "@/context";
import { clearToken, useFilterHandle } from "@/utils";
import {
  getCall,
  fetchCallCount,
  updateRequestStatus,
  closeRequest,
  fetchBusinessSettings,
  fetchProfileInfo,
  fetchCallDetail,
} from "@/api";
import { REQUEST_STATUSES } from "@/constants/Statuses";
import { ProButton, ProStageDynamicColor } from "@/components";
import { Cancel } from "./Cancel";
import ProWarningModal from "@/components/ProWarningModal";
import Close from "./Close";
import { useApi } from "@/hooks";
import Detail from "./Detail";
import Comment from "./Comment";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { ROLES } from "@/constants/Roles";

interface Props {
  showCancelModal: any;
  showCloseModal: any;
  setReturnToDispatcherConfirmDialog: any;
  cancelModalIsVisible: boolean;
  closeModalIsVisible: boolean;
  returnToDispatcherConfirmDialog: any;
  cancelModalRequestId: any;
  hideCancelModal: any;
  hideCloseModal?: any;
  closeModalRequestId?: any;
  profile?: any;
}

const tableData = {
  tableHead: [
    "No",
    "ASA",
    "Çağırış tarixi",
    "Status",
    "Yazışma",
    "Həkim",
    "Feldşer",
    "Seç",
  ],
  widthArr: [50, 200, 140, 140, 80, 80, 80, 60],
  tableData: [],
};

export function useCancelOperationModal() {
  const [requestId, setRequestId] = useState(0);
  const hideCancelModal = () => {
    setRequestId(0);
  };
  const showCancelModal = (rId: any) => {
    setRequestId(rId);
  };
  return {
    cancelModalRequestId: requestId,
    cancelModalIsVisible: Boolean(requestId),
    hideCancelModal,
    showCancelModal,
  };
}

export function memberFormat(data: {
  name: any;
  lastName: any;
  patronymic: any;
}) {
  return data
    ? `${data?.name} ${data.lastName || ""} ${data.patronymic || ""} `
    : "";
}

export function useCloseOperationModal() {
  const [requestId, setRequestId] = useState(0);
  const hideCloseModal = () => {
    setRequestId(0);
  };
  const showCloseModal = (rId: any) => {
    setRequestId(rId);
  };
  return {
    closeModalRequestId: requestId,
    closeModalIsVisible: Boolean(requestId),
    hideCloseModal,
    showCloseModal,
  };
}

const FirstRoute = (props: Props) => {
  const {
    showCancelModal,
    showCloseModal,
    setReturnToDispatcherConfirmDialog,
    cancelModalIsVisible,
    closeModalIsVisible,
    returnToDispatcherConfirmDialog,
    cancelModalRequestId,
    hideCancelModal,
    hideCloseModal,
    closeModalRequestId,
    profile,
  } = props;

  const [data, setData] = useState(tableData);
  const [tableDataOne, setTableDataOne] = useState<any>([]);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [callCount, setCallCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [index, setIndex] = useState(2);
  const [selectedCall, setSelectedCall] = useState(undefined);
  const [chatModal, setChatModal] = useState(false);
  const [selectedId, setSelectedId] = useState(false);

  const [filter, onFilter, setFilter] = useFilterHandle(
    {
      limit: pageSize,
      page: currentPage,
      statuses: ["awaiting_ambulance", "processing_by_ambulance"],
      fr: 0,
    },
    () => {
      getCall(filter).then((productData) => {
        setTableDataOne(productData);
      });
      fetchCallCount(filter).then(
        (productData: React.SetStateAction<number>) => {
          setCallCount(productData);
        }
      );
    }
  );

  const TASK_NAME = "myTaskName";

  TaskManager.defineTask(TASK_NAME, () => {
    try {
      getCall([
        {
          limit: 8,
          page: 1,
          statuses: ["awaiting_ambulance", "processing_by_ambulance"],
        },
      ]).then((productData) => {
        if (
          productData.filter(
            ({ status }: any) =>
              status === "awaiting_dispatcher" ||
              status === "awaiting_ambulance"
          ).length > 0
        ) {
          console.log("test");
          schedulePushNotification();
        }

        return productData
          ? BackgroundFetch.BackgroundFetchResult.NewData
          : BackgroundFetch.BackgroundFetchResult.NoData;
      });
    } catch (err) {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });

  const RegisterBackgroundTask = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 5,
      });
      console.log("Task registered");
    } catch (err) {
      console.log("Task Register failed:", err);
    }
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const handlePaginationChange = (value: any) => {
    onFilter("page", value);
    return (() => setCurrentPage(value))();
  };

  useEffect(() => {
    RegisterBackgroundTask();
    const intervalId = setInterval(() => {
      if (
        filter.page === 1 &&
        !(
          cancelModalIsVisible ||
          closeModalIsVisible ||
          returnToDispatcherConfirmDialog
        )
      ) {
        onFilter("fr", filter.fr ? parseInt(filter.fr) + 1 : 1);
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const handleStatusChange = (id: any, status: any) => {
    if (status === "return_to_dispatcher") {
      setReturnToDispatcherConfirmDialog(id);
    } else {
      updateRequestStatus({ id, status }).then((resp: any) => {
        onFilter("fr", filter.fr ? parseInt(filter.fr) + 1 : 1);
        if (status === "processing_by_ambulance") {
          fetchCallDetail({ id }).then((resp: any) => {
            setSelectedCall(resp);
            setShowModal(true);
            setIndex(0);
          });
        }
      });
    }
  };

  const handleView = (id: any) => {
    fetchCallDetail({ id }).then((resp: any) => {
      setSelectedCall(resp);
      setShowModal(true);
      setIndex(2);
    });
  };

  useEffect(() => {
    setData({
      ...data,
      tableData: tableDataOne.map(
        (
          {
            surname,
            name,
            patronymic,
            operationDate,
            status,
            statusId,
            statusName,
            id,
            members,
          }: any,
          index: number
        ) => {
          const rowStatus = status;
          const statuses = [];

          if (rowStatus === "awaiting_ambulance") {
            statuses.push(REQUEST_STATUSES.processing_by_ambulance);
          } else if (rowStatus === "processing_by_ambulance") {
            statuses.push(REQUEST_STATUSES.closed);
            statuses.push(REQUEST_STATUSES.return_to_dispatcher);
          }

          const formattedStatusData = statuses.length
            ? statuses.map((item) => ({
                id: item.id,
                label: item.name,
                color: `#${item.color.toString().padStart(6, "0")}`,
              }))
            : [];
          const isEnabled = [
            "awaiting_ambulance",
            "processing_by_ambulance",
          ].includes(rowStatus);

          const statusNames = REQUEST_STATUSES[rowStatus].name;
          return [
            (currentPage - 1) * pageSize + index + 1,
            `${surname} ${name} ${patronymic}`,
            moment(operationDate).format("DD-MM-YYYY HH:mm"),
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ProStageDynamicColor
                disabled={!isEnabled}
                statuses={
                  statuses
                    ? formattedStatusData
                    : [
                        {
                          id: statusId,
                          label: statusName,
                          color: "00000",
                        },
                      ]
                }
                color={`#${REQUEST_STATUSES[rowStatus].color
                  .toString(16)
                  .padStart(6, "0")}`}
                onChange={(newStageId: any) => {
                  if (handleStatusChange && newStageId !== rowStatus) {
                    if (newStageId === "cancelled") {
                      showCancelModal(id);
                    } else if (newStageId === "closed") {
                      showCloseModal(id);
                    } else {
                      handleStatusChange(id, newStageId);
                    }
                  }
                }}
                statusName={statusNames}
                visualStage={{ id: statusNames }}
              />
            </View>,
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo
                name="chat"
                size={16}
                color="black"
                onPress={() => {
                  console.log("ok");
                  setSelectedId(id);
                  setChatModal(true);
                }}
              />
            </View>,
            <Text> {memberFormat(members?.[ROLES.Doctor]?.[0])}</Text>,
            <Text>{memberFormat(members?.[ROLES.Paramedic]?.[0])}</Text>,
            // <View
            //   style={{
            //     display: "flex",
            //     flexDirection: "row",
            //     alignItems: "center",
            //     justifyContent: "center",
            //   }}
            // >
            //   <Feather name="play" size={14} color="black" />
            // </View>,
            <ProButton
              label={<AntDesign name="eyeo" size={16} color="black" />}
              type="transparent"
              onClick={() => {
                handleView(id);
              }}
            />,
          ];
        }
      ),
    });
  }, [tableDataOne, returnToDispatcherConfirmDialog, showCloseModal]);

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Yeni Bildiriş! 🔔",
        body: "Sizin yeni statuslu çağırışınız var",
        data: { data: "goes here" },
      },
      trigger: { seconds: 5 },
    });
  }

  // function sendPushNotificationsHandler() {
  //   fetch('https://exp.host/--/api/v2/push/send', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Accept-encoding': 'gzip, deflate',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(message),
  //   });
  // }
  console.log(chatModal);
  useEffect(() => {
    if (
      tableDataOne.filter(
        ({ status }: any) =>
          status === "awaiting_dispatcher" || status === "awaiting_ambulance"
      ).length > 0
    ) {
      schedulePushNotification();
    }
  }, [tableDataOne]);

  return (
    <View style={styles.container}>
      <Detail
        isVisible={showModal}
        handleModal={(isSubmit = false) => {
          if (isSubmit) {
            console.log("ok");
          }

          setShowModal(false);
        }}
        selectedCall={selectedCall}
        index={index}
        setIndex={setIndex}
        fromFirst={true}
      />

      {chatModal && (
        <Comment
          isVisible={chatModal}
          handleModal={(isSubmit = false) => {
            if (isSubmit) {
              console.log("ok");
            }

            setChatModal(false);
          }}
          selectedId={selectedId}
        />
      )}
      {returnToDispatcherConfirmDialog && (
        <ProWarningModal
          open={true}
          // titleIcon={<Icon type="warning" />}
          bodyContent=""
          continueText="Bəli"
          okFunc={() => {
            updateRequestStatus({
              id: returnToDispatcherConfirmDialog,
              status: "awaiting_dispatcher",
            }).then((resp: any) => {
              onFilter("fr", filter.fr ? parseInt(filter.fr) + 1 : 1);
              setReturnToDispatcherConfirmDialog(false);
            });
          }}
          onCancel={() => setReturnToDispatcherConfirmDialog(false)}
          header="Çağırışdan imtina etmək istəyirsiniz?"
          bodyTitle='Çağırışdan "imtina" etdiyiniz halda çağırış "Dispetçer"ə geri qaytarılacaqdır !.'
        />
      )}

      {cancelModalIsVisible && (
        <Cancel
          requestInfo={
            tableDataOne.filter((d: any) => d.id === cancelModalRequestId)[0]
          }
          isVisible={true}
          handleModal={(isSubmit = false) => {
            if (isSubmit) {
              onFilter("fr", filter.fr ? parseInt(filter.fr) + 1 : 1);
            }

            hideCancelModal();
          }}
          maxLength={5000}
        />
      )}

      {closeModalIsVisible && (
        <Close
          requestInfo={
            tableDataOne.filter((d: any) => d.id === closeModalRequestId)[0]
          }
          isVisible={true}
          handleModal={(isSubmit = false) => {
            if (isSubmit) {
              onFilter("fr", filter.fr ? parseInt(filter.fr) + 1 : 1);
            }

            hideCloseModal();
          }}
          maxLength={5000}
          closeRequest={closeRequest}
          fetchBusinessSettings={fetchBusinessSettings}
          profile={profile}
        />
      )}
      <ScrollView>
        <ScrollView
          nestedScrollEnabled={true}
          horizontal={true}
          style={{ height: "100%" }}
        >
          <Table borderStyle={{ borderWidth: 1, borderColor: "white" }}>
            <Row
              data={data.tableHead}
              widthArr={data.widthArr}
              style={styles.head}
              textStyle={styles.headText}
            />
            {data.tableData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                widthArr={data.widthArr}
                style={styles.rowSection}
                textStyle={styles.text}
              />
            ))}
          </Table>
        </ScrollView>
      </ScrollView>
      <View>
        <Pagination
          totalItems={callCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePaginationChange}
          textStyle={{ fontSize: 6 }}
        />
      </View>
    </View>
  );
};
const SecondRoute = (props: Props) => {
  const {
    showCancelModal,
    showCloseModal,
    setReturnToDispatcherConfirmDialog,
    cancelModalIsVisible,
    closeModalIsVisible,
    returnToDispatcherConfirmDialog,
    cancelModalRequestId,
    hideCancelModal,
  } = props;

  const [data, setData] = useState(tableData);
  const [tableDataTwo, setTableDataTwo] = useState<any>([]);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [callCount, setCallCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedCall, setSelectedCall] = useState(undefined);
  const [chatModal, setChatModal] = useState(false);
  const [selectedId, setSelectedId] = useState(false);

  const [filter, onFilter, setFilter] = useFilterHandle(
    {
      limit: pageSize,
      page: currentPage,
      statuses: ["closed"],
    },
    () => {
      getCall(filter).then((productData) => {
        setTableDataTwo(productData);
      });
      fetchCallCount(filter).then(
        (productData: React.SetStateAction<number>) => {
          setCallCount(productData);
        }
      );
    }
  );

  const handlePaginationChange = (value: any) => {
    onFilter("page", value);
    return (() => setCurrentPage(value))();
  };

  const handleStatusChange = (id: any, status: any) => {
    if (status === "return_to_dispatcher") {
      setReturnToDispatcherConfirmDialog(id);
    } else {
      updateRequestStatus({ id, status }).then((resp: any) => {
        onFilter("fr", filter.fr ? parseInt(filter.fr) + 1 : 1);
        if (status === "processing_by_ambulance") {
          // handleEditClick(id);
        }
      });
    }
  };
  const handleView = (id: any) => {
    fetchCallDetail({ id }).then((resp: any) => {
      setSelectedCall(resp);
      setShowModal(true);
    });
  };

  useEffect(() => {
    setData({
      ...data,
      tableData: tableDataTwo.map(
        (
          {
            surname,
            name,
            patronymic,
            operationDate,
            status,
            statusId,
            statusName,
            id,
            members,
          }: any,
          index: number
        ) => {
          const rowStatus = status;
          const statuses = [];

          if (rowStatus === "awaiting_ambulance") {
            statuses.push(REQUEST_STATUSES.processing_by_ambulance);
          } else if (rowStatus === "processing_by_ambulance") {
            statuses.push(REQUEST_STATUSES.closed);
            statuses.push(REQUEST_STATUSES.return_to_dispatcher);
          }

          const formattedStatusData = statuses.length
            ? statuses.map((item) => ({
                id: item.id,
                label: item.name,
                color: `#${item.color.toString().padStart(6, "0")}`,
              }))
            : [];
          const isEnabled = [
            "awaiting_ambulance",
            "processing_by_ambulance",
          ].includes(rowStatus);

          const statusNames = REQUEST_STATUSES[rowStatus].name;

          return [
            (currentPage - 1) * pageSize + index + 1,
            `${surname} ${name} ${patronymic}`,
            moment(operationDate).format("DD-MM-YYYY HH:mm"),
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ProStageDynamicColor
                disabled={!isEnabled}
                statuses={
                  statuses
                    ? formattedStatusData
                    : [
                        {
                          id: statusId,
                          label: statusName,
                          color: "00000",
                        },
                      ]
                }
                color={`#${REQUEST_STATUSES[rowStatus].color
                  .toString(16)
                  .padStart(6, "0")}`}
                onChange={(newStageId: any) => {
                  if (handleStatusChange && newStageId !== rowStatus) {
                    if (newStageId === "cancelled") {
                      showCancelModal(id);
                    } else if (newStageId === "closed") {
                      showCloseModal(id);
                    } else {
                      handleStatusChange(id, newStageId);
                    }
                  }
                }}
                statusName={statusNames}
                visualStage={{ id: statusNames }}
              />
            </View>,
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo
                name="chat"
                size={16}
                color="black"
                onPress={() => {
                  console.log("ok");
                  setSelectedId(id);
                  setChatModal(true);
                }}
              />
            </View>,
            <Text> {memberFormat(members?.[ROLES.Doctor]?.[0])}</Text>,
            <Text>{memberFormat(members?.[ROLES.Paramedic]?.[0])}</Text>,
            // <View
            //   style={{
            //     display: "flex",
            //     flexDirection: "row",
            //     alignItems: "center",
            //     justifyContent: "center",
            //   }}
            // >
            //   <Feather name="play" size={14} color="black" />
            // </View>,
            <ProButton
              label={<AntDesign name="eyeo" size={16} color="black" />}
              type="transparent"
              onClick={() => {
                handleView(id);
              }}
            />,
          ];
        }
      ),
    });
  }, [tableDataTwo]);

  return (
    <View style={styles.container}>
      {showModal && (
        <Detail
          isVisible={showModal}
          handleModal={(isSubmit = false) => {
            if (isSubmit) {
              console.log("ok");
            }

            setShowModal(false);
          }}
          selectedCall={selectedCall}
          index={index}
          setIndex={setIndex}
        ></Detail>
      )}
      {chatModal && (
        <Comment
          isVisible={chatModal}
          handleModal={(isSubmit = false) => {
            if (isSubmit) {
              console.log("ok");
            }

            setChatModal(false);
          }}
          selectedId={selectedId}
        />
      )}
      {cancelModalIsVisible && (
        <Cancel
          requestInfo={
            data.tableData.filter((d: any) => d.id === cancelModalRequestId)[0]
          }
          isVisible={true}
          handleModal={(isSubmit = false) => {
            if (isSubmit) {
              // const queryParams = params;
              onFilter("fr", filter.fr ? parseInt(filter.fr) + 1 : 1);
            }

            hideCancelModal();
          }}
          maxLength={5000}
        />
      )}

      {/* {closeModalIsVisible && (
        <Close
          requestInfo={
            tableData.filter((d: any) => d.id === closeModalRequestId)[0]
          }
          isVisible={true}
          handleModal={(isSubmit = false) => {
            if (isSubmit) {
              const queryParams = params;
              onFilter("fr", queryParams.fr ? parseInt(queryParams.fr) + 1 : 1);
            }

            hideCloseModal();
          }}
          maxLength={5000}
        />
      )} */}
      <ScrollView>
        <ScrollView
          nestedScrollEnabled={true}
          horizontal={true}
          style={{ height: "100%" }}
        >
          <Table borderStyle={{ borderWidth: 1, borderColor: "white" }}>
            <Row
              data={data.tableHead}
              widthArr={data.widthArr}
              style={styles.head}
              textStyle={styles.headText}
            />
            {data.tableData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                widthArr={data.widthArr}
                style={styles.rowSection}
                textStyle={styles.text}
              />
            ))}
          </Table>
        </ScrollView>
      </ScrollView>
      <View>
        <Pagination
          totalItems={callCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePaginationChange}
          textStyle={{ fontSize: 6 }}
        />
      </View>
    </View>
  );
};

const ThirdRoute = (props: Props) => {
  const {
    showCancelModal,
    showCloseModal,
    setReturnToDispatcherConfirmDialog,
    cancelModalIsVisible,
    closeModalIsVisible,
    returnToDispatcherConfirmDialog,
    cancelModalRequestId,
    hideCancelModal,
  } = props;

  const [data, setData] = useState(tableData);
  const [tableDataThree, setTableDataThree] = useState<any>([]);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [callCount, setCallCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedCall, setSelectedCall] = useState(undefined);

  const [filter, onFilter, setFilter] = useFilterHandle(
    {
      limit: pageSize,
      page: currentPage,
      statuses: ["cancelled"],
    },
    () => {
      getCall(filter).then((productData) => {
        setTableDataThree(productData);
      });
      fetchCallCount(filter).then(
        (productData: React.SetStateAction<number>) => {
          setCallCount(productData);
        }
      );
    }
  );

  const handlePaginationChange = (value: any) => {
    onFilter("page", value);
    return (() => setCurrentPage(value))();
  };

  const handleStatusChange = (id: any, status: any) => {
    if (status === "return_to_dispatcher") {
      setReturnToDispatcherConfirmDialog(id);
    } else {
      updateRequestStatus({ id, status }).then((resp: any) => {
        onFilter("fr", filter.fr ? parseInt(filter.fr) + 1 : 1);
        if (status === "processing_by_ambulance") {
          // handleEditClick(id);
        }
      });
    }
  };

  const handleView = (id: any) => {
    fetchCallDetail({ id }).then((resp: any) => {
      setSelectedCall(resp);
      setShowModal(true);
    });
  };

  useEffect(() => {
    setData({
      ...data,
      tableData: tableDataThree.map(
        (
          {
            surname,
            name,
            patronymic,
            operationDate,
            status,
            statusId,
            statusName,
            id,
          }: any,
          index: number
        ) => {
          const rowStatus = status;
          const statuses = [];

          if (rowStatus === "awaiting_ambulance") {
            statuses.push(REQUEST_STATUSES.processing_by_ambulance);
          } else if (rowStatus === "processing_by_ambulance") {
            statuses.push(REQUEST_STATUSES.closed);
            statuses.push(REQUEST_STATUSES.return_to_dispatcher);
          }

          const formattedStatusData = statuses.length
            ? statuses.map((item) => ({
                id: item.id,
                label: item.name,
                color: `#${item.color.toString().padStart(6, "0")}`,
              }))
            : [];
          const isEnabled = [
            "awaiting_ambulance",
            "processing_by_ambulance",
          ].includes(rowStatus);

          const statusNames = REQUEST_STATUSES[rowStatus].name;

          return [
            (currentPage - 1) * pageSize + index + 1,
            `${surname} ${name} ${patronymic}`,
            moment(operationDate).format("DD-MM-YYYY HH:mm"),
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ProStageDynamicColor
                disabled={!isEnabled}
                statuses={
                  statuses
                    ? formattedStatusData
                    : [
                        {
                          id: statusId,
                          label: statusName,
                          color: "00000",
                        },
                      ]
                }
                color={`#${REQUEST_STATUSES[rowStatus].color
                  .toString(16)
                  .padStart(6, "0")}`}
                onChange={(newStageId: any) => {
                  if (handleStatusChange && newStageId !== rowStatus) {
                    if (newStageId === "cancelled") {
                      showCancelModal(id);
                    } else if (newStageId === "closed") {
                      showCloseModal(id);
                    } else {
                      handleStatusChange(id, newStageId);
                    }
                  }
                }}
                statusName={statusNames}
                visualStage={{ id: statusNames }}
              />
            </View>,
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo name="chat" size={14} color="black" />
            </View>,
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="play" size={14} color="black" />
            </View>,
            <ProButton
              label={<AntDesign name="eyeo" size={16} color="black" />}
              type="transparent"
              onClick={() => {
                handleView(id);
              }}
            />,
          ];
        }
      ),
    });
  }, [tableDataThree]);

  return (
    <View style={styles.container}>
      {showModal && (
        <Detail
          isVisible={showModal}
          handleModal={(isSubmit = false) => {
            if (isSubmit) {
              console.log("ok");
            }

            setShowModal(false);
          }}
          selectedCall={selectedCall}
          index={index}
          setIndex={setIndex}
        ></Detail>
      )}
      {cancelModalIsVisible && (
        <Cancel
          requestInfo={
            data.tableData.filter((d: any) => d.id === cancelModalRequestId)[0]
          }
          isVisible={true}
          handleModal={(isSubmit = false) => {
            if (isSubmit) {
              // const queryParams = params;
              onFilter("fr", filter.fr ? parseInt(filter.fr) + 1 : 1);
            }

            hideCancelModal();
          }}
          maxLength={5000}
        />
      )}

      {/* {closeModalIsVisible && (
        <Close
          requestInfo={
            tableData.filter((d: any) => d.id === closeModalRequestId)[0]
          }
          isVisible={true}
          handleModal={(isSubmit = false) => {
            if (isSubmit) {
              const queryParams = params;
              onFilter("fr", queryParams.fr ? parseInt(queryParams.fr) + 1 : 1);
            }

            hideCloseModal();
          }}
          maxLength={5000}
        />
      )} */}
      <ScrollView>
        <ScrollView
          nestedScrollEnabled={true}
          horizontal={true}
          style={{ height: "100%" }}
        >
          <Table borderStyle={{ borderWidth: 1, borderColor: "white" }}>
            <Row
              data={data.tableHead}
              widthArr={data.widthArr}
              style={styles.head}
              textStyle={styles.headText}
            />
            {data.tableData.map((rowData, index) => (
              <Row
                key={index}
                data={rowData}
                widthArr={data.widthArr}
                style={styles.rowSection}
                textStyle={styles.text}
              />
            ))}
          </Table>
        </ScrollView>
      </ScrollView>
      <View>
        <Pagination
          totalItems={callCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePaginationChange}
          textStyle={{ fontSize: 6 }}
        />
      </View>
    </View>
  );
};

const Dashboard = ({}) => {
  const { profile, setProfile } = useContext(TenantContext);
  const { isLogged, setIsLogged } = useContext(AuthContext);
  const { showActionSheetWithOptions } = useActionSheet();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [returnToDispatcherConfirmDialog, setReturnToDispatcherConfirmDialog] =
    useState(false);
  const [routes] = useState([
    { key: "first", title: "İcrada" },
    { key: "second", title: "Bağlı" },
  ]);

  const {
    cancelModalIsVisible,
    cancelModalRequestId,
    hideCancelModal,
    showCancelModal,
  } = useCancelOperationModal();
  const {
    closeModalIsVisible,
    closeModalRequestId,
    hideCloseModal,
    showCloseModal,
  } = useCloseOperationModal();

  const { isPending: load } = useApi({
    promiseFn: fetchProfileInfo,
    onResolve: (data: any) => {
      setProfile(data);
    },
    onReject: () => {
      console.log("err");
    },
  });

  const doUserLogOut = () => {
    const options = ["Çıxış"];
    const cancelButtonIndex = 999;
    const containerStyle = {
      maxHeight: 400,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    };

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        containerStyle,
      },
      (selectedIndex: any) => {
        switch (selectedIndex) {
          case 0:
            clearToken()
              .then(async () => {
                setIsLogged(false);
                return true;
              })
              .catch((error: { message: string | undefined }) => {
                Alert.alert("Error!", error.message);
                return false;
              });
            break;
        }
      }
    );
  };

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return (
          <FirstRoute
            showCancelModal={showCancelModal}
            showCloseModal={showCloseModal}
            setReturnToDispatcherConfirmDialog={
              setReturnToDispatcherConfirmDialog
            }
            cancelModalIsVisible={cancelModalIsVisible}
            closeModalIsVisible={closeModalIsVisible}
            returnToDispatcherConfirmDialog={returnToDispatcherConfirmDialog}
            cancelModalRequestId={cancelModalRequestId}
            hideCancelModal={hideCancelModal}
            hideCloseModal={hideCloseModal}
            closeModalRequestId={closeModalRequestId}
            profile={profile}
          />
        );
      case "second":
        return (
          <SecondRoute
            showCancelModal={showCancelModal}
            showCloseModal={showCloseModal}
            setReturnToDispatcherConfirmDialog={
              setReturnToDispatcherConfirmDialog
            }
            cancelModalIsVisible={cancelModalIsVisible}
            closeModalIsVisible={closeModalIsVisible}
            returnToDispatcherConfirmDialog={returnToDispatcherConfirmDialog}
            cancelModalRequestId={cancelModalRequestId}
            hideCancelModal={hideCancelModal}
          />
        );
      // case "third":
      //   return (
      //     <ThirdRoute
      //       showCancelModal={showCancelModal}
      //       showCloseModal={showCloseModal}
      //       setReturnToDispatcherConfirmDialog={
      //         setReturnToDispatcherConfirmDialog
      //       }
      //       cancelModalIsVisible={cancelModalIsVisible}
      //       closeModalIsVisible={closeModalIsVisible}
      //       returnToDispatcherConfirmDialog={returnToDispatcherConfirmDialog}
      //       cancelModalRequestId={cancelModalRequestId}
      //       hideCancelModal={hideCancelModal}
      //     />
      //   );
      default:
        return null;
    }
  };

  const renderBadge = ({ route }: any) => {
    if (route.key === "albums") {
      return (
        <View>
          <Text>42</Text>
        </View>
      );
    }
    return null;
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      renderBadge={renderBadge}
      labelStyle={{ color: "#37B874" }}
      style={styles.tabbar}
    />
  );

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <View style={styles.inputContainer}>
          <Image source={require("@/assets/images/logo.png")} />
          <TouchableOpacity
            onPress={() => {
              doUserLogOut();
            }}
          >
            {profile?.attachment?.thumb ? (
              <Image
                src={profile?.attachment?.thumb}
                style={{ borderRadius: 50, width: 40, height: 40 }}
              />
            ) : (
              <Image
                source={require("@/assets/images/default.jpg")}
                style={{ borderRadius: 50, width: 40, height: 40 }}
              />
            )}
          </TouchableOpacity>
        </View>
        <TabView
          lazy
          key={JSON.stringify(index)}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
          swipeEnabled={false}
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#37B874",
  },
  carouselContainer: {
    marginTop: 60,
  },
  buttonBorder: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#6fc99c",
    width: 80,
    padding: 20,
  },
  tabbar: {
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
    gap: 10,
  },
  rowSection: { flexDirection: "row", borderWidth: 1, borderColor: "#eeeeee" },
  head: { height: 44, backgroundColor: "#55ab80" },
  headText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  text: { fontSize: 14, textAlign: "center" },
});

export default Dashboard;
