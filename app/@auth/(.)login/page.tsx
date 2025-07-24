import Modal from "@/app/ui/modal"
import { LoginForm } from "@/components/auth/login-form"

export default function InterceptedLoginPage() {
  return (
    <Modal>
      <LoginForm />
    </Modal>
  )
}
