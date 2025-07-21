"use client"

import React from "react"

import { useState } from "react"
import RoleSwitcher from "@/components/role-switcher"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentRole, setCurrentRole] = useState<"admin" | "user" | null>(null)

  return (
    <>
      <RoleSwitcher onRoleChange={setCurrentRole} currentRole={currentRole} />
      <div className="role-context" data-role={currentRole}>
        {React.cloneElement(children as React.ReactElement, { currentRole })}
      </div>
    </>
  )
}
