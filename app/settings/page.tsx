"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  Bell,
  Shield,
  User,
  Mail,
  Save,
  Moon,
  Sun,
  Monitor,
  Pencil,
  Eye,
  Database,
  CloudIcon as CloudCheck,
  Server,
  AlertTriangle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const { role } = useAuth()
  const [activeTab, setActiveTab] = useState("general")
  const [dbConnected, setDbConnected] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    systemName: "Cybernaut Task Management",
    companyName: "Cybernaut Technologies",
    contactEmail: "admin@cybernaut.com",
    timezone: "UTC+0",
    dateFormat: "MM/DD/YYYY",
    theme: "system",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    taskAssignments: true,
    taskUpdates: true,
    systemAnnouncements: true,
    dailyDigest: false,
    attendanceAlerts: true,
    resourceUpdates: true,
    batchChanges: true,
    reportGeneration: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    ipRestriction: false,
    userActivityLogs: true,
    secureDataTransfer: true,
    autoLogout: true,
    passwordExpiry: "90days",
    sessionTimeout: "30min",
    loginAttempts: "5",
    encryptionEnabled: true,
  })

  const [dbSettings, setDbSettings] = useState({
    dbHost: "localhost",
    dbPort: "3306",
    dbName: "cybernaut_atms",
    dbUser: "admin",
    connectionPool: "10",
    backupSchedule: "daily",
    backupRetention: "30days",
  })

  const [isEditing, setIsEditing] = useState({
    general: false,
    notifications: false,
    security: false,
    database: false,
  })

  const handleSaveSettings = (settingType) => {
    setIsEditing({ ...isEditing, [settingType]: false })

    toast.success("Settings Saved", {
      description: `Your ${settingType} settings have been updated successfully.`,
    })
  }

  const handleConnectDb = () => {
    // Simulate database connection
    toast.loading("Connecting to Database", {
      description: "Attempting to establish connection to the database...",
    })

    // Simulate connection delay
    setTimeout(() => {
      setDbConnected(true)
      toast.success("Database Connected", {
        description: "Successfully connected to the database.",
      })
    }, 2000)
  }

  const handleToggle2FA = () => {
    setSecuritySettings((prevSettings) => ({
      ...prevSettings,
      twoFactorAuth: !prevSettings.twoFactorAuth,
    }))
    toast(`Two-Factor Authentication ${securitySettings.twoFactorAuth ? 'disabled' : 'enabled'}`)
  }

  if (role !== "admin" && role !== "superAdmin") {
    return <div>Access Denied</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      {!dbConnected && (
        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle>Database Connection Required</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Connect to a database to enable full system functionality.</span>
            <Button size="sm" onClick={handleConnectDb} className="ml-4 bg-amber-600 hover:bg-amber-700">
              <Database className="h-4 w-4 mr-2" />
              Connect Database
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="general" className="flex items-center justify-center">
            <User className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center justify-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center justify-center">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center justify-center">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your system's general configuration</CardDescription>
              </div>
              <Button
                variant={isEditing.general ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditing({ ...isEditing, general: !isEditing.general })}
              >
                {isEditing.general ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    View Mode
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Mode
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={generalSettings.systemName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, systemName: e.target.value })}
                    disabled={!isEditing.general}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={generalSettings.companyName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, companyName: e.target.value })}
                    disabled={!isEditing.general}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <div className="flex">
                    <Mail className="h-4 w-4 mr-2 mt-3 text-gray-500" />
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                      disabled={!isEditing.general}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                    disabled={!isEditing.general}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">Greenwich Mean Time (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                      <SelectItem value="UTC+5:30">Indian Standard Time (UTC+5:30)</SelectItem>
                      <SelectItem value="UTC+8">China Standard Time (UTC+8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={generalSettings.dateFormat}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, dateFormat: value })}
                    disabled={!isEditing.general}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Default Theme</Label>
                  <div className="flex space-x-4">
                    <Button
                      variant={generalSettings.theme === "light" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => isEditing.general && setGeneralSettings({ ...generalSettings, theme: "light" })}
                      disabled={!isEditing.general}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button
                      variant={generalSettings.theme === "dark" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => isEditing.general && setGeneralSettings({ ...generalSettings, theme: "dark" })}
                      disabled={!isEditing.general}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button
                      variant={generalSettings.theme === "system" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => isEditing.general && setGeneralSettings({ ...generalSettings, theme: "system" })}
                      disabled={!isEditing.general}
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Badge className={dbConnected ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                    {dbConnected ? "Connected" : "Not Connected"}
                  </Badge>
                  <span className="text-sm text-gray-500">Database Status</span>
                </div>
              </div>

              {isEditing.general && (
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveSettings("general")}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when notifications are sent</CardDescription>
              </div>
              <Button
                variant={isEditing.notifications ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditing({ ...isEditing, notifications: !isEditing.notifications })}
              >
                {isEditing.notifications ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    View Mode
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Mode
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable or disable all email notifications</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      isEditing.notifications &&
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                    disabled={!isEditing.notifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="taskAssignments">Task Assignments</Label>
                    <p className="text-sm text-muted-foreground">Notify when a task is assigned to a user</p>
                  </div>
                  <Switch
                    id="taskAssignments"
                    checked={notificationSettings.taskAssignments}
                    onCheckedChange={(checked) =>
                      isEditing.notifications &&
                      setNotificationSettings({ ...notificationSettings, taskAssignments: checked })
                    }
                    disabled={!isEditing.notifications || !notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="taskUpdates">Task Updates</Label>
                    <p className="text-sm text-muted-foreground">Notify when a task is updated or its status changes</p>
                  </div>
                  <Switch
                    id="taskUpdates"
                    checked={notificationSettings.taskUpdates}
                    onCheckedChange={(checked) =>
                      isEditing.notifications &&
                      setNotificationSettings({ ...notificationSettings, taskUpdates: checked })
                    }
                    disabled={!isEditing.notifications || !notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="attendanceAlerts">Attendance Alerts</Label>
                    <p className="text-sm text-muted-foreground">Send alerts when attendance is marked or updated</p>
                  </div>
                  <Switch
                    id="attendanceAlerts"
                    checked={notificationSettings.attendanceAlerts}
                    onCheckedChange={(checked) =>
                      isEditing.notifications &&
                      setNotificationSettings({ ...notificationSettings, attendanceAlerts: checked })
                    }
                    disabled={!isEditing.notifications || !notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="resourceUpdates">Resource Updates</Label>
                    <p className="text-sm text-muted-foreground">Notify when new resources are uploaded or assigned</p>
                  </div>
                  <Switch
                    id="resourceUpdates"
                    checked={notificationSettings.resourceUpdates}
                    onCheckedChange={(checked) =>
                      isEditing.notifications &&
                      setNotificationSettings({ ...notificationSettings, resourceUpdates: checked })
                    }
                    disabled={!isEditing.notifications || !notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="batchChanges">Batch Changes</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about new batches or changes to existing ones
                    </p>
                  </div>
                  <Switch
                    id="batchChanges"
                    checked={notificationSettings.batchChanges}
                    onCheckedChange={(checked) =>
                      isEditing.notifications &&
                      setNotificationSettings({ ...notificationSettings, batchChanges: checked })
                    }
                    disabled={!isEditing.notifications || !notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reportGeneration">Report Generation</Label>
                    <p className="text-sm text-muted-foreground">Notify when reports are generated or available</p>
                  </div>
                  <Switch
                    id="reportGeneration"
                    checked={notificationSettings.reportGeneration}
                    onCheckedChange={(checked) =>
                      isEditing.notifications &&
                      setNotificationSettings({ ...notificationSettings, reportGeneration: checked })
                    }
                    disabled={!isEditing.notifications || !notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="systemAnnouncements">System Announcements</Label>
                    <p className="text-sm text-muted-foreground">Notify about system-wide announcements and updates</p>
                  </div>
                  <Switch
                    id="systemAnnouncements"
                    checked={notificationSettings.systemAnnouncements}
                    onCheckedChange={(checked) =>
                      isEditing.notifications &&
                      setNotificationSettings({ ...notificationSettings, systemAnnouncements: checked })
                    }
                    disabled={!isEditing.notifications || !notificationSettings.emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dailyDigest">Daily Digest</Label>
                    <p className="text-sm text-muted-foreground">Receive a daily summary of all activities</p>
                  </div>
                  <Switch
                    id="dailyDigest"
                    checked={notificationSettings.dailyDigest}
                    onCheckedChange={(checked) =>
                      isEditing.notifications &&
                      setNotificationSettings({ ...notificationSettings, dailyDigest: checked })
                    }
                    disabled={!isEditing.notifications || !notificationSettings.emailNotifications}
                  />
                </div>
              </div>

              {isEditing.notifications && (
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveSettings("notifications")}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security features like 2FA.</CardDescription>
              </div>
              <Button
                variant={isEditing.security ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditing({ ...isEditing, security: !isEditing.security })}
              >
                {isEditing.security ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    View Mode
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Mode
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Two-Factor Authentication</Label>
                <Switch checked={securitySettings.twoFactorAuth} onChange={handleToggle2FA} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Database Configuration</CardTitle>
                <CardDescription>Manage database connection and settings</CardDescription>
              </div>
              <Button
                variant={isEditing.database ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditing({ ...isEditing, database: !isEditing.database })}
              >
                {isEditing.database ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    View Mode
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Mode
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className={dbConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {dbConnected ? (
                    <span className="flex items-center">
                      <CloudCheck className="h-3 w-3 mr-1" /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" /> Not Connected
                    </span>
                  )}
                </Badge>

                {!dbConnected && (
                  <Button size="sm" onClick={handleConnectDb}>
                    <Server className="h-4 w-4 mr-2" />
                    Connect Now
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dbHost">Database Host</Label>
                  <Input
                    id="dbHost"
                    value={dbSettings.dbHost}
                    onChange={(e) => setDbSettings({ ...dbSettings, dbHost: e.target.value })}
                    disabled={!isEditing.database}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbPort">Database Port</Label>
                  <Input
                    id="dbPort"
                    value={dbSettings.dbPort}
                    onChange={(e) => setDbSettings({ ...dbSettings, dbPort: e.target.value })}
                    disabled={!isEditing.database}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dbName">Database Name</Label>
                  <Input
                    id="dbName"
                    value={dbSettings.dbName}
                    onChange={(e) => setDbSettings({ ...dbSettings, dbName: e.target.value })}
                    disabled={!isEditing.database}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbUser">Database User</Label>
                  <Input
                    id="dbUser"
                    value={dbSettings.dbUser}
                    onChange={(e) => setDbSettings({ ...dbSettings, dbUser: e.target.value })}
                    disabled={!isEditing.database}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="connectionPool">Connection Pool</Label>
                  <Select
                    value={dbSettings.connectionPool}
                    onValueChange={(value) => setDbSettings({ ...dbSettings, connectionPool: value })}
                    disabled={!isEditing.database}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pool size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Connections</SelectItem>
                      <SelectItem value="10">10 Connections</SelectItem>
                      <SelectItem value="20">20 Connections</SelectItem>
                      <SelectItem value="50">50 Connections</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupSchedule">Backup Schedule</Label>
                  <Select
                    value={dbSettings.backupSchedule}
                    onValueChange={(value) => setDbSettings({ ...dbSettings, backupSchedule: value })}
                    disabled={!isEditing.database}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupRetention">Backup Retention Period</Label>
                <Select
                  value={dbSettings.backupRetention}
                  onValueChange={(value) => setDbSettings({ ...dbSettings, backupRetention: value })}
                  disabled={!isEditing.database}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="90days">90 Days</SelectItem>
                    <SelectItem value="365days">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isEditing.database && (
                <div className="flex justify-end">
                  <Button onClick={() => handleSaveSettings("database")}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Database Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
