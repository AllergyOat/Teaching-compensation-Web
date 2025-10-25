import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={true}
      richColors
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          success:
            "bg-gradient-to-r from-green-50 to-white border-l-4 border-l-green-500 shadow-lg",
          error:
            "bg-gradient-to-r from-red-50 to-white border-l-4 border-l-red-500 shadow-lg",
          warning:
            "bg-gradient-to-r from-yellow-50 to-white border-l-4 border-l-yellow-500 shadow-lg",
          info: "bg-gradient-to-r from-blue-50 to-white border-l-4 border-l-blue-500 shadow-lg",
          title: "text-gray-900 font-semibold",
          description: "text-gray-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
