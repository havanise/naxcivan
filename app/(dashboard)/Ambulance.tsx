/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput } from "react-native";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { ProButton, ProFormInput, ProAsyncSelect } from "@/components";
import CheckBox from "expo-checkbox";
import { useApi } from "@/hooks";
import {
  fetchInitialDiagnoses,
  fetchUnitBrigade,
  fetchMedInstitution,
  updateAmbulanceRequest,
} from "@/api";
import { ROLES } from "@/constants/Roles";

const Ambulance = ({ selectedCall, handleModal }: any) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
  } = useForm({
    // defaultValues: {
    //   dateOfTransaction: new Date(),
    // },
  });

  const formatAllMembers = (
    doctor: any,
    orderly: any,
    paramedic: any,
    driver: any
  ) => {
    console.log(paramedic);
    let members_ul: any[] = [];

    if (doctor) {
      members_ul = [
        ...members_ul,
        {
          member: doctor,
          type: ROLES.Doctor,
        },
      ];
    }
    if (orderly) {
      for (var n in orderly) {
        members_ul = [
          ...members_ul,
          {
            member: orderly[n],
            type: ROLES.Orderly,
          },
        ];
      }
    }

    if (paramedic) {
      for (var n in paramedic) {
        members_ul = [
          ...members_ul,
          {
            member: paramedic[n],
            type: ROLES.Paramedic,
          },
        ];
      }
    }

    if (driver) {
      members_ul = [
        ...members_ul,
        {
          member: driver,
          type: ROLES.Driver,
        },
      ];
    }
    console.log(members_ul, "members_ul");
    return members_ul;
  };

  useEffect(() => {
    if (selectedCall) {
      // setCcId(selectedRequestDetail?.id);
      // setFsCallId(selectedRequestDetail?.calls?.[0]?.id);
      const rData = selectedCall || null;
      if (rData) {
        setValue("additionalExamination", rData.additionalExamination || null);
        setValue("therapeuticActions", rData.therapeuticActions || null);
        setValue(
          "medicalInstitutionFrom",
          rData.medicalInstitutionFrom?.id || null
        );
        setValue("bloodPressure", rData.bloodPressure || null);
        setValue("temperature", rData.temperature || null);
        setValue("pulse", rData.pulse || null);
        setValue("spO2", rData.spO2 || null);
        setValue(
          "medicalInstitutionTo",
          rData.medicalInstitutionTo?.id || null
        );

        if (rData.medicalInstitutionFrom || rData.medicalInstitutionTo) {
          setIsEvacuated(true);
        }

        if (rData.businessUnit?.id) {
          const brigadeId = rData.brigade?.id || null;
          if (brigadeId) {
            /* TimeOut is temporary measure to wait until brigade select is filled with data */
            setTimeout(function () {
              console.log(rData?.members?.[ROLES.Paramedic]?.[0], "teteet");
              setValue(
                "doctor_req",
                rData?.members?.[ROLES.Doctor]?.[0]?.id || null
              );
              setValue(
                "driver",
                rData?.members?.[ROLES.Driver]?.[0]?.id || null
              );
              console.log(
                rData?.members?.[ROLES.Paramedic]?.map((e: any) => e.id) || []
              );
              setValue(
                "paramedic",
                rData?.members?.[ROLES.Paramedic]?.map((e: any) => e.id) || null
              );
              setValue(
                "orderly",
                rData?.members?.[ROLES.Orderly]?.map((e: any) => e.id) || null
              );
            }, 2000);
          }
        }

        setValue("firstDiagnosis", rData.diagnosis?.parent.id);

        if (rData.diagnosis?.id) {
          setTimeout(function () {
            // setValue("firstDiagnosis", rData.diagnosis?.parent.id);
            setValue("diagnosis", rData.diagnosis?.id);
          }, 500);
        }
      }
    }
  }, [selectedCall]);

  const onSubmit = (data: any) => {
    const {
      additionalExamination,
      bloodPressure,
      diagnosis,
      medicalInstitutionFrom,
      medicalInstitutionTo,
      pulse,
      spO2,
      temperature,
      therapeuticActions,
      doctor_req,
      orderly,
      paramedic,
      driver,
    } = data;
    updateAmbulanceRequest({
      id: selectedCall.id,
      data: {
        bloodPressure: bloodPressure || null,
        diagnosis,
        medicalInstitutionFrom:  isEvacuated? medicalInstitutionFrom || null : null,
        medicalInstitutionTo: isEvacuated?  medicalInstitutionTo || null : null,
        pulse: pulse || null,
        spO2: spO2 || null,
        temperature: temperature || null,
        therapeuticActions: therapeuticActions || null,
        additionalExamination: additionalExamination || null,
        members_ul: formatAllMembers(doctor_req, orderly, paramedic, driver),
      },
    })
      .then((res: any) => {
        Toast.show({
          type: "success",
          text1: "Məlumatlar yadda saxlandı.",
        });
        handleModal(false);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const [initialDiagnoses, setInitialDiagnoses] = useState<any>([]);
  const [selectedUnitBrigade, setSelectedUnitBrigade] = useState<any>([]);
  const [isEvacuated, setIsEvacuated] = useState<any>(false);
  const [medicalInstitution, setMedicalInstitution] = useState<any>([]);
  const [diagnosis, setDiagnosis] = useState<any>([]);

  function membersFormat(data: any) {
    if (data && data.length) {
      const newD = data.map((member: any) => ({
        ...member,
        value: member.id,
        label: ` ${member.name} ${member.lastName || ""} ${
          member.patronymic || ""
        }`,
      }));
      return newD;
    }
    return [];
  }

  const { isLoading, run } = useApi({
    deferFn: fetchInitialDiagnoses,
    onResolve: (data: any) => {
      setInitialDiagnoses(
        data.map((item: any) => ({ ...item, label: item.name, value: item.id }))
      );
      if (selectedCall) {
        setDiagnosis(
          data
            .map((item: any) => ({ ...item, label: item.name, value: item.id }))
            .filter(
              (v: any) => v.id === selectedCall?.diagnosis?.parent.id
            )?.[0]
            ?.children?.map((item: any) => ({
              ...item,
              label: item.name,
              value: item.id,
            }))
        );
      }
    },
    onReject: (error) => {
      console.log(error, "rejected");
    },
  });

  const { isLoading: isLoad, run: runMedicalInstitution } = useApi({
    deferFn: fetchMedInstitution,
    onResolve: (data: any) => {
      setMedicalInstitution(
        data.map((item: any) => ({ ...item, label: item.name, value: item.id }))
      );
    },
    onReject: (error) => {
      console.log(error, "rejected");
    },
  });

  useEffect(() => {
    runMedicalInstitution({});
    run({});
    if (selectedCall?.businessUnit?.id) {
      fetchUnitBrigade([{
        businessIid: selectedCall?.businessUnit?.id,
      }]).then((resp: any) => {
        setSelectedUnitBrigade(resp || []);
      });
    } else {
      setSelectedUnitBrigade([]);
    }
  }, []);

  // useEffect(() => {
  //   console.log(getValues("firstDiagnosis"), 'teet')
  //   if (getValues("firstDiagnosis") && initialDiagnoses.length) {
  //     setDiagnosis(
  //       initialDiagnoses
  //         .filter((v: any) => v.id === getValues("firstDiagnosis"))[0]
  //         .children?.map((item: any) => ({
  //           ...item,
  //           label: item.name,
  //           value: item.id,
  //         }))
  //     );
  //   } else {
  //     setDiagnosis([]);
  //   }
  // }, [getValues("firstDiagnosis"), initialDiagnoses]);

  return (
    <ScrollView>
      <View style={{ justifyContent: "space-between", height: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            gap: 20,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: "48%",
              rowGap: 10,
            }}
          >
            <ProAsyncSelect
              label={"İlkin diaqnoz (Təsnifatı)"}
              control={control}
              required={true}
              data={initialDiagnoses}
              async={false}
              setData={setInitialDiagnoses}
              fetchData={fetchInitialDiagnoses}
              name="firstDiagnosis"
              allowClear={false}
              handleSelectValue={(id: any) => {
                setDiagnosis(
                  initialDiagnoses
                    .filter((v: any) => v.id === id)[0]
                    .children?.map((item: any) => ({
                      ...item,
                      label: item.name,
                      value: item.id,
                    }))
                );
              }}
            />
            <ProAsyncSelect
              label={"İlkin diaqnoz (Xəstəlik)"}
              control={control}
              required={true}
              async={false}
              data={diagnosis}
              setData={() => {}}
              fetchData={() => {}}
              name="diagnosis"
            />
            <ProFormInput
              multiline={true}
              label="Əlavə müayinə məlumatları"
              name="additionalExamination"
              control={control}
              style={{ textAlignVertical: "top" }}
            />
            <ProFormInput
              multiline={true}
              label="Təyinat və müalicə tədbirləri"
              name="therapeuticActions"
              control={control}
              style={{ textAlignVertical: "top" }}
            />
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={isEvacuated}
                onValueChange={(e: any) => {
                  setIsEvacuated(Boolean(e));
                }}
              />
              <Text style={{ marginLeft: 5 }}> Təxliyyə edildi</Text>
            </View>
            {isEvacuated && (
              <>
                <ProAsyncSelect
                  label={"Haradan"}
                  control={control}
                  data={[
                    {
                      value: null,
                      label: "Çağırış ünvanı",
                    },
                    ...medicalInstitution,
                  ]}
                  setData={() => {}}
                  fetchData={() => {}}
                  name="medicalInstitutionFrom"
                />
                <ProAsyncSelect
                  label={"Haraya"}
                  control={control}
                  data={[
                    {
                      value: null,
                      label: "Çağırış ünvanı",
                    },
                    ...medicalInstitution,
                  ]}
                  setData={() => {}}
                  fetchData={() => {}}
                  name="medicalInstitutionTo"
                />
              </>
            )}
          </View>
          <View
            style={{
              width: "48%",
              rowGap: 10,
            }}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              <ProFormInput
                label="A/T"
                name="bloodPressure"
                control={control}
                width="48%"
              />
              <ProFormInput
                label="Nəbzi"
                name="pulse"
                control={control}
                width="48%"
              />
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <ProFormInput
                label="Hərarət"
                name="temperature"
                control={control}
                width="48%"
              />
              <ProFormInput
                label="SpO2"
                name="spO2"
                control={control}
                width="48%"
              />
            </View>
            <ProAsyncSelect
              label={"Həkim"}
              control={control}
              data={membersFormat(
                selectedCall?.brigade?.id
                  ? selectedUnitBrigade?.filter(
                      (data: any) =>
                        data.id === Number(selectedCall?.brigade?.id)
                    )?.[0]?.members?.[ROLES.Doctor]
                  : []
              )}
              setData={() => {}}
              fetchData={() => {}}
              name="doctor_req"
            />
            <ProAsyncSelect
              isMulti={true}
              label={"Sanitar"}
              control={control}
              data={membersFormat(
                selectedCall?.brigade?.id
                  ? selectedUnitBrigade?.filter(
                      (data: any) =>
                        data.id === Number(selectedCall?.brigade?.id)
                    )?.[0]?.members?.[ROLES.Orderly]
                  : []
              )}
              setData={() => {}}
              fetchData={() => {}}
              name="orderly"
            />
            <ProAsyncSelect
              isMulti={true}
              label={"Feldşer"}
              control={control}
              data={membersFormat(
                selectedCall?.brigade?.id
                  ? selectedUnitBrigade?.filter(
                      (data: any) =>
                        data.id === Number(selectedCall?.brigade?.id)
                    )?.[0]?.members?.[ROLES.Paramedic]
                  : []
              )}
              setData={() => {}}
              fetchData={() => {}}
              name="paramedic"
            />
            <ProAsyncSelect
              label={"Sürücü"}
              control={control}
              data={membersFormat(
                selectedCall?.brigade?.id
                  ? selectedUnitBrigade?.filter(
                      (data: any) =>
                        data.id === Number(selectedCall?.brigade?.id)
                    )?.[0]?.members?.[ROLES.Driver]
                  : []
              )}
              setData={() => {}}
              fetchData={() => {}}
              name="driver"
            />
          </View>
        </View>

        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <ProButton
            label="Təsdiqlə"
            type="primary"
            flex={false}
            style={{ width: 150 }}
            onClick={handleSubmit(onSubmit)}
            defaultStyle={{ borderRadius: 5 }}
            buttonBorder={styles.buttonStyle}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    color: "#505050",
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#efefef",
    paddingBottom: 5,
  },
  buttonStyle: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "transparent",
  },
  checkboxContainer: {
    flexDirection: "row",
  },
});

export default Ambulance;
