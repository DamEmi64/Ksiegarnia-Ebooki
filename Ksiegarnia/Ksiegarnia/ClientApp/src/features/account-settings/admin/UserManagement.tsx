﻿import { Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import UserDTO from "../../../models/api/userDTO";
import React from "react";
import UserService from "../../../services/UserService";
import Loading from "../../../pages/Loading";
import { Role } from "../../../models/api/role";
import AdminService from "../../../services/AdminService";

const Data = (props: { label: string; value: string }) => {
  return (
    <React.Fragment>
      <Grid item xs={12} md={5} container justifyContent="space-between">
        <Grid item xs={6} container>
          <Typography
            variant="h6"
            display="inline"
            width="100%"
            textAlign="start"
          >
            {props.label}
          </Typography>
        </Grid>
        <Grid item xs={6} container>
          <Typography
            variant="h6"
            display="inline"
            width="100%"
            textAlign="end"
          >
            {props.value}
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

interface RoleValue {
  value: Role;
  checked: boolean;
}

const UserManagement = () => {
  const userId = useParams().userId;

  const [userData, setUserData] = React.useState<UserDTO>();
  const [userRolesValues, setUserRolesValues] = React.useState<RoleValue[]>([]);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userId) {
      navigate("/not-found");
    }

    UserService.getById(userId as string)
      .then((response) => {
        const newUserData = response.data;

        setUserData(newUserData);

        setUserRolesValues(
          Object.keys(Role).map((role: string) => {
            const roleEnum = Role[role as keyof typeof Role];
            const isChecked = newUserData.roles.includes(roleEnum);

            return {
              value: roleEnum,
              checked: isChecked,
            };
          })
        );
      })
      .catch(() => {
        navigate("/not-found");
      });
  }, []);

  if (!userData) {
    return <Loading />;
  }

  const handleChangeRole = (checked: boolean, role: Role) => {
    if (checked) {
      AdminService.addRoleToUser(userData.id, role)
      .then(() => {
        const newRole: RoleValue = {
          value: role,
          checked: true,
        };
        const newRoles = [...userRolesValues, newRole];
        setUserRolesValues(newRoles);
      });
    } else {
      AdminService.removeRoleFromUser(userData.id, role)
      .then(() => {
        const newRoles = userRolesValues.filter(
          (roleValue: RoleValue) => roleValue.value != role
        );
        setUserRolesValues(newRoles);
      });
    }
  };

  return (
    <Grid item container justifyContent="center" rowGap={8}>
      <Grid
        item
        xs={12}
        lg={11}
        container
        justifyContent={{ xs: "center", md: "space-between" }}
        rowGap={6}
      >
        <Data label={"Imię"} value={userData.firstName} />
        <Data label={"Nazwisko"} value={userData.lastName} />
        <Data label={"E-mail"} value={userData.email} />
        <Data label={"Pseudonim"} value={userData.nick} />
        <Data label={"Numer tel."} value={userData.phone} />
        <Data label={"Wiek"} value={userData.age.toString()} />
      </Grid>
      <Grid item container direction="column" alignItems="center" rowGap={2}>
        <Typography variant="h4">Role</Typography>
        <Grid item container justifyContent="center" rowGap={2}>
          <Grid
            item
            xs={11}
            sm={8}
            md={6}
            lg={4}
            container
            direction="column"
            rowGap={1}
          >
            {userRolesValues.map((roleValue: RoleValue, index: number) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={roleValue.checked}
                    onChange={(event: any, checked: boolean) =>
                      handleChangeRole(checked, roleValue.value)
                    }
                  />
                }
                label={roleValue.value}
              />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserManagement;
