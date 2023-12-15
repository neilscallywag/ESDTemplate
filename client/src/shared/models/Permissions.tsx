type PermissionsModel = {
  [key: string]: string[];
};

const applicationPermissions: PermissionsModel = {
  dashboard: ["org.admin", "org.user"],
  gayneil: ["org.admin", "org.permissions.SERVICENAME.read"],

  /*
   * Below are examples of permissions that can be used in the application
   * settings: ['org.admin', 'org.permissions.settings.manage'],
   * userManagement: ['org.admin', 'org.permissions.user.manage'],
   * reports: ['org.permissions.reports.read', 'org.permissions.reports.write'],
   */
};

export default applicationPermissions;
