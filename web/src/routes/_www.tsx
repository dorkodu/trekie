import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/www/_layout")({
	component: WebsiteLayout,
});

function WebsiteLayout() {
	return (
		<div>
			<h1>Website Layout</h1>
			<Outlet />
		</div>
	);
}
