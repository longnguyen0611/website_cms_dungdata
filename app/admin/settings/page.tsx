"use client"

import { useState } from "react"
import { Save, Upload, Globe, Mail, Shield, Palette, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import AuthCheck from "@/components/admin/auth-check"

export default function AdminSettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Dũng Data",
    siteDescription: "Website chia sẻ tài liệu, ebook, dữ liệu mẫu và bài viết chuyên sâu",
    siteUrl: "https://dungdata.com",
    adminEmail: "admin@dungdata.com",
    timezone: "Asia/Ho_Chi_Minh",
    language: "vi",

    // Content Settings
    postsPerPage: 12,
    allowComments: true,
    moderateComments: true,
    allowRegistration: true,
    defaultUserRole: "user",

    // Email Settings
    smtpHost: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    smtpEncryption: "tls",

    // SEO Settings
    metaTitle: "Dũng Data - Chia sẻ dữ liệu, kiến thức và nghiên cứu",
    metaDescription: "Website chia sẻ tài liệu, ebook, dữ liệu mẫu chất lượng cao cho người học SPSS",
    metaKeywords: "SPSS, nghiên cứu, dữ liệu, ebook, thống kê",
    googleAnalytics: "",

    // Security Settings
    enableTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    enableCaptcha: false,
  })

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings:`, settings)
    // Handle save logic here
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <AdminHeader title="Cấu hình hệ thống" sidebarCollapsed={sidebarCollapsed} />

          <main className="p-6">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="general">Chung</TabsTrigger>
                  <TabsTrigger value="content">Nội dung</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="security">Bảo mật</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Cấu hình chung
                      </CardTitle>
                      <CardDescription>Thiết lập thông tin cơ bản của website</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="siteName">Tên website *</Label>
                          <Input
                            id="siteName"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="siteUrl">URL website *</Label>
                          <Input
                            id="siteUrl"
                            value={settings.siteUrl}
                            onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="siteDescription">Mô tả website</Label>
                        <Textarea
                          id="siteDescription"
                          rows={3}
                          value={settings.siteDescription}
                          onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="adminEmail">Email quản trị *</Label>
                          <Input
                            id="adminEmail"
                            type="email"
                            value={settings.adminEmail}
                            onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Múi giờ</Label>
                          <Select
                            value={settings.timezone}
                            onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</SelectItem>
                              <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                              <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Logo website</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <Button variant="outline" size="sm">
                              Chọn logo
                            </Button>
                            <p className="mt-2 text-xs text-gray-500">PNG, JPG, SVG tối đa 2MB</p>
                          </div>
                        </div>
                      </div>

                      <Button onClick={() => handleSave("general")}>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu cấu hình chung
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Content Settings */}
                <TabsContent value="content">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Cấu hình nội dung
                      </CardTitle>
                      <CardDescription>Thiết lập hiển thị và quản lý nội dung</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="postsPerPage">Số bài viết mỗi trang</Label>
                          <Input
                            id="postsPerPage"
                            type="number"
                            value={settings.postsPerPage}
                            onChange={(e) =>
                              setSettings({ ...settings, postsPerPage: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="defaultUserRole">Vai trò mặc định</Label>
                          <Select
                            value={settings.defaultUserRole}
                            onValueChange={(value) => setSettings({ ...settings, defaultUserRole: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium">Cài đặt bình luận</h4>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allowComments">Cho phép bình luận</Label>
                          <Switch
                            id="allowComments"
                            checked={settings.allowComments}
                            onCheckedChange={(checked) => setSettings({ ...settings, allowComments: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="moderateComments">Kiểm duyệt bình luận</Label>
                          <Switch
                            id="moderateComments"
                            checked={settings.moderateComments}
                            onCheckedChange={(checked) => setSettings({ ...settings, moderateComments: checked })}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium">Đăng ký thành viên</h4>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allowRegistration">Cho phép đăng ký</Label>
                          <Switch
                            id="allowRegistration"
                            checked={settings.allowRegistration}
                            onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
                          />
                        </div>
                      </div>

                      <Button onClick={() => handleSave("content")}>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu cấu hình nội dung
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Email Settings */}
                <TabsContent value="email">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Cấu hình Email
                      </CardTitle>
                      <CardDescription>Thiết lập SMTP để gửi email tự động</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="smtpHost">SMTP Host</Label>
                          <Input
                            id="smtpHost"
                            placeholder="smtp.gmail.com"
                            value={settings.smtpHost}
                            onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtpPort">SMTP Port</Label>
                          <Input
                            id="smtpPort"
                            value={settings.smtpPort}
                            onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="smtpUsername">SMTP Username</Label>
                          <Input
                            id="smtpUsername"
                            value={settings.smtpUsername}
                            onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtpPassword">SMTP Password</Label>
                          <Input
                            id="smtpPassword"
                            type="password"
                            value={settings.smtpPassword}
                            onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smtpEncryption">Mã hóa</Label>
                        <Select
                          value={settings.smtpEncryption}
                          onValueChange={(value) => setSettings({ ...settings, smtpEncryption: value })}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tls">TLS</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                            <SelectItem value="none">Không mã hóa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline">Test Email</Button>
                        <Button onClick={() => handleSave("email")}>
                          <Save className="mr-2 h-4 w-4" />
                          Lưu cấu hình Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SEO Settings */}
                <TabsContent value="seo">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Cấu hình SEO
                      </CardTitle>
                      <CardDescription>Tối ưu hóa công cụ tìm kiếm</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input
                          id="metaTitle"
                          value={settings.metaTitle}
                          onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                        />
                        <p className="text-xs text-gray-500">Tối đa 60 ký tự</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <Textarea
                          id="metaDescription"
                          rows={3}
                          value={settings.metaDescription}
                          onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                        />
                        <p className="text-xs text-gray-500">Tối đa 160 ký tự</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaKeywords">Meta Keywords</Label>
                        <Input
                          id="metaKeywords"
                          placeholder="keyword1, keyword2, keyword3"
                          value={settings.metaKeywords}
                          onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                        <Input
                          id="googleAnalytics"
                          placeholder="G-XXXXXXXXXX"
                          value={settings.googleAnalytics}
                          onChange={(e) => setSettings({ ...settings, googleAnalytics: e.target.value })}
                        />
                      </div>

                      <Button onClick={() => handleSave("seo")}>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu cấu hình SEO
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Cấu hình bảo mật
                      </CardTitle>
                      <CardDescription>Thiết lập bảo mật và xác thực</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="enableTwoFactor">Xác thực 2 bước</Label>
                            <p className="text-sm text-gray-500">Bắt buộc xác thực 2 bước cho admin</p>
                          </div>
                          <Switch
                            id="enableTwoFactor"
                            checked={settings.enableTwoFactor}
                            onCheckedChange={(checked) => setSettings({ ...settings, enableTwoFactor: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="enableCaptcha">Bật CAPTCHA</Label>
                            <p className="text-sm text-gray-500">Hiển thị CAPTCHA khi đăng nhập</p>
                          </div>
                          <Switch
                            id="enableCaptcha"
                            checked={settings.enableCaptcha}
                            onCheckedChange={(checked) => setSettings({ ...settings, enableCaptcha: checked })}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Thời gian session (giờ)</Label>
                          <Input
                            id="sessionTimeout"
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e) =>
                              setSettings({ ...settings, sessionTimeout: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</Label>
                          <Input
                            id="maxLoginAttempts"
                            type="number"
                            value={settings.maxLoginAttempts}
                            onChange={(e) =>
                              setSettings({ ...settings, maxLoginAttempts: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>

                      <Button onClick={() => handleSave("security")}>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu cấu hình bảo mật
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
