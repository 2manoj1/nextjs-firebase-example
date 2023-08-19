import Image from "next/image";
import { Inter } from "next/font/google";
import { PermissionPushModal } from "@/components/modal/permission-push";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
			<h1>Push Notification Demo</h1>
		</main>
	);
}
