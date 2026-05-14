import { router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#f5f5f5]">

            {/* TOP BAR */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">

                <button
                    onClick={() => window.history.back()}
                    className="w-10 h-10 rounded-full flex items-center justify-center active:bg-gray-100 transition"
                >
                    <ArrowLeft className="w-5 h-5 text-[#111827]" />
                </button>

                <h1 className="text-[18px] font-semibold text-[#111827]">
                    Privacy Policy
                </h1>

            </div>

            {/* CONTENT */}
            <div className="px-4 py-6 pb-12 max-w-3xl mx-auto">

                {/* HEADING */}
                <div className="text-center mb-6">

                    <h1 className="text-[42px] leading-[48px] font-bold text-[#0f172a] mb-4">
                        Privacy Policy
                    </h1>

                    <p className="text-[17px] leading-8 text-gray-500 max-w-2xl mx-auto">
                        This Privacy Policy explains how Quick Home Loan
                        collects, uses, and protects your information.
                    </p>

                </div>

                {/* CARDS */}
                <div className="space-y-5">

                    {/* Information Collection */}
                    <Card
                        title="Information Collection :"
                    >
                        <p className="text-[16px] text-gray-700 leading-8 mb-5">
                            We collect the following types of information:
                        </p>

                        <ul className="list-disc pl-6 space-y-5 text-[16px] text-gray-700 leading-9">

                            <li>
                                <span className="font-semibold">
                                    Personal Information:
                                </span>{" "}
                                Name, phone number, email, address,
                                employment details, income, and loan
                                requirements.
                            </li>

                            <li>
                                <span className="font-semibold">
                                    Financial Information:
                                </span>{" "}
                                Basic financial details required for loan
                                eligibility (we do not store sensitive
                                banking credentials).
                            </li>

                            <li>
                                <span className="font-semibold">
                                    Technical Information:
                                </span>{" "}
                                IP address, browser type, device
                                information, and usage data.
                            </li>

                        </ul>
                    </Card>

                    {/* Purpose */}
                    <Card title="Purpose of Information Use :">

                        <p className="text-[16px] text-gray-700 leading-8 mb-5">
                            We use your information for:
                        </p>

                        <ul className="list-disc pl-6 space-y-5 text-[16px] text-gray-700 leading-9">

                            <li>
                                Processing loan inquiries and connecting
                                with lenders
                            </li>

                            <li>
                                Customer support and communication
                            </li>

                            <li>
                                Marketing and promotional updates (with
                                consent)
                            </li>

                            <li>
                                Improving website performance and user
                                experience
                            </li>

                        </ul>

                    </Card>

                    {/* Information Sharing */}
                    <Card title="Information Sharing :">

                        <p className="text-[16px] text-gray-700 leading-8 mb-5">
                            We may share your data with:
                        </p>

                        <ul className="list-disc pl-6 space-y-5 text-[16px] text-gray-700 leading-9">

                            <li>Banks and NBFCs</li>

                            <li>Lending partners and DSAs</li>

                            <li>
                                Service providers for processing
                                applications
                            </li>

                            <li>
                                Legal authorities when required
                            </li>

                        </ul>

                    </Card>

                    {/* Cookies */}
                    <Card title="Cookies :">

                        <p className="text-[16px] text-gray-700 leading-8">
                            We use cookies to enhance user experience and
                            analyze traffic. Users can disable cookies via
                            browser settings.
                        </p>

                    </Card>

                    {/* Data Security */}
                    <Card title="Data Security :">

                        <p className="text-[16px] text-gray-700 leading-8">
                            We implement industry-standard security
                            measures. However, no online platform is
                            completely secure.
                        </p>

                    </Card>

                    {/* User Rights */}
                    <Card title="User Rights :">

                        <p className="text-[16px] text-gray-700 leading-8 mb-5">
                            You have the right to:
                        </p>

                        <ul className="list-disc pl-6 space-y-5 text-[16px] text-gray-700 leading-9">

                            <li>Access your personal data</li>

                            <li>
                                Request correction or deletion
                            </li>

                            <li>
                                Opt-out of marketing communications
                            </li>

                        </ul>

                    </Card>

                    {/* Children */}
                    <Card title="Children's Privacy :">

                        <p className="text-[16px] text-gray-700 leading-8">
                            Our services are not intended for individuals
                            under 18 years of age.
                        </p>

                    </Card>

                    {/* Updates */}
                    <Card title="Policy Updates :">

                        <p className="text-[16px] text-gray-700 leading-8">
                            We may update this policy from time to time.
                            Changes will be posted on this page.
                        </p>

                    </Card>

                </div>

            </div>

        </div>
    );
}

/* CARD COMPONENT */

function Card({ title, children }) {
    return (
        <div className="bg-white border border-gray-200 rounded-[28px] overflow-hidden shadow-sm">

            <div className="bg-[#f3f4f6] px-5 py-4 border-b border-gray-200">

                <h2 className="text-[20px] md:text-[24px] font-semibold text-[#0f172a]">
                    {title}
                </h2>

            </div>

            <div className="px-5 py-6">
                {children}
            </div>

        </div>
    );
}