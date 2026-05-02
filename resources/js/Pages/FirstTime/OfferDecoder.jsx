import AppLayout from "@/Layouts/AppLayout";
import FirstTimeLayout from "@/Components/Common/FirstTimeLayout";
import OfferDecoderCalculator from "@/Components/FirstTime/OfferDecoder/OfferDecoderCalculator";
import LearnTab from "@/Components/FirstTime/OfferDecoder/LearnTab";

export default function OfferDecoder() {
    return (
        <AppLayout showTopNav={false} showBottomNav={false} showFooter={false}>
            <FirstTimeLayout
                title="Offer Truth Decoder"
                CalculateComponent={OfferDecoderCalculator}
                GuideComponent={LearnTab}
            />
        </AppLayout>
    );
}