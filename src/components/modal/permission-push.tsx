import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { useFCM } from "@/config/useFcm";
import { Button } from "../ui/button";

export const PermissionPushModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	const { loadToken } = useFCM();

	useEffect(() => {
		if ("Notification" in window && Notification.permission !== "granted")
			setIsOpen(true);
	}, []);

	const handleSubmit = () => {
		loadToken();
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Need Push Notifications permission!</DialogTitle>
				</DialogHeader>
				<DialogFooter>
					<Button type="submit" onClick={handleSubmit}>
						Yes
					</Button>
					<Button type="reset" variant="outline" onClick={handleSubmit}>
						No
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
