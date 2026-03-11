import { Text } from '@/shared/components/ui/text'
import { GroundBackground } from '@/shared/components/ui/ground-background'
import { router } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TermsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <GroundBackground />
      <View className="flex-row items-center px-4 pt-2 pb-3 border-b border-border">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center py-2 pr-4 active:opacity-60"
        >
          <ChevronLeft size={22} color="hsl(30 36% 17%)" />
          <Text className="text-base text-foreground">이전</Text>
        </Pressable>
        <View className="flex-1 mr-14">
          <Text className="text-base font-semibold text-foreground text-center">이용약관</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 py-6">
        <Text className="text-sm text-foreground leading-6">
{`제1조 (목적)
이 약관은 씨앗모아(이하 "앱")가 제공하는 성경 암송 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 앱이 제공하는 성경 구절 암송, 복습 관리, 성장 기록 등의 기능을 말합니다.
2. "회원"이란 본 약관에 동의하고 서비스에 가입한 자를 말합니다.

제3조 (약관의 효력 및 변경)
1. 본 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다.
2. 약관이 변경될 경우 앱 내 공지를 통해 알려드립니다.

제4조 (서비스의 제공)
1. 앱은 다음과 같은 서비스를 제공합니다:
   - 성경 구절 검색 및 저장
   - 간격 반복 학습을 활용한 암송 연습
   - 성장 기록 및 통계
   - 알림 서비스
2. 서비스는 무료로 제공됩니다.

제5조 (회원의 의무)
1. 회원은 서비스 이용 시 관련 법령을 준수해야 합니다.
2. 회원은 타인의 정보를 부정하게 사용해서는 안 됩니다.

제6조 (서비스 중단)
앱은 시스템 점검, 장비 교체 등의 사유로 서비스를 일시 중단할 수 있습니다.

제7조 (면책 조항)
앱은 천재지변 또는 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
