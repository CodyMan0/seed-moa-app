import { Text } from '@/shared/components/ui/text'
import { GroundBackground } from '@/shared/components/ui/ground-background'
import { router } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { Pressable, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PrivacyScreen() {
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
          <Text className="text-base font-semibold text-foreground text-center">개인정보처리방침</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 py-6">
        <Text className="text-sm text-foreground leading-6">
{`씨앗모아(이하 "앱")는 회원의 개인정보를 소중히 여기며, 개인정보보호법에 따라 다음과 같이 개인정보를 처리합니다.

1. 수집하는 개인정보 항목
   - 필수: 이메일 주소
   - 선택: 닉네임
   - 자동 수집: 앱 이용 기록, 암송 학습 데이터

2. 개인정보의 수집 및 이용 목적
   - 회원 가입 및 관리
   - 서비스 제공 (암송 기록 저장, 복습 알림)
   - 서비스 개선 및 통계 분석

3. 개인정보의 보유 및 이용 기간
   - 회원 탈퇴 시까지 보유하며, 탈퇴 시 즉시 파기합니다.

4. 개인정보의 제3자 제공
   - 앱은 회원의 개인정보를 제3자에게 제공하지 않습니다.

5. 개인정보의 파기 절차 및 방법
   - 회원 탈퇴 요청 시 즉시 파기합니다.
   - 전자적 파일은 복구 불가능한 방법으로 삭제합니다.

6. 개인정보 보호 책임자
   - 문의사항은 앱 내 "문의하기"를 통해 연락해주세요.

7. 개인정보처리방침의 변경
   - 본 방침이 변경될 경우 앱 내 공지를 통해 알려드립니다.

시행일: 2026년 3월 1일`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
