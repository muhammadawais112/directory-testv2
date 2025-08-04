import "./globals.css";
import { AgencyProvider } from "./context/agency";
import { TopnavProvider } from "./context/topnav";
import { UserProvider } from "./context/user";
import LayoutWrapper from "./(components)/LayoutWrapper";


export const metadata = {
  title: "Smart Directory",
  description: "AI-powered business directory with events, services and more.",
     icons: {
        icon: 'https://storage.googleapis.com/msgsndr/EEanQVm0jG9RxVMHl8G4/media/77a74cfa-d8ee-407f-8a78-17b0f4290193.png',
      },
     openGraph: {
    title: "Smart Directory",
    description: "AI-powered business directory with events, services and more.",
    url: "https://yourdomain.com",
    type: "website",
    images: [
      {
        url: "https://storage.googleapis.com/msgsndr/EEanQVm0jG9RxVMHl8G4/media/77a74cfa-d8ee-407f-8a78-17b0f4290193.png",
        width: 1200,
        height: 630,
        alt: "Smart Directory Preview Image",
      },
    ],
  },
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
