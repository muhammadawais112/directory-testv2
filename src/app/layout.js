import "./globals.css";
import { AgencyProvider } from "./context/agency";
import { TopnavProvider } from "./context/topnav";
import { UserProvider } from "./context/user";
import LayoutWrapper from "./(components)/LayoutWrapper";


export const metadata = {
  title: "Smart Directory",
  description: "AI-powered business directory with events, services and more.",
};



export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head />
            <body>
                <AgencyProvider>
                    <TopnavProvider>
                        <UserProvider>
                            <LayoutWrapper>
                                {children}
                            </LayoutWrapper>
                        </UserProvider>
                    </TopnavProvider>
                </AgencyProvider>
            </body>
        </html>
    );
}
