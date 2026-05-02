import AppLayout from "@/Layouts/AppLayout";
import FirstTimeLayout from "@/Components/Common/FirstTimeLayout";
import RateShockCalculator from "@/Components/FirstTime/RateShockSimulator/RateShockCalculator";
import LearnTab from "@/Components/FirstTime/RateShockSimulator/LearnTab";

export default function RateShockSimulator() {
    return (
        <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
            <FirstTimeLayout
                title="Rate Shock Simulator"
                CalculateComponent={RateShockCalculator}

                GuideComponent={LearnTab}
            />
        </AppLayout>
    );
}