import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, Text, TouchableOpacity, Linking, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColors';
import ProgressBar from '@/components/ui/ProgressBar';
import TableGrid from '@/components/TableGrid';
import { useLocalSearchParams } from 'expo-router';

// Move types OUTSIDE the component (top-level)
type Projects = {
  cursus_ids?: number[];
  final_mark?: number | null;
  'validated?': boolean | null;
  project?: { name: string };
  status?: string;
  updated_at?: string;
};

type Skill = {
  id: number;
  name: string;
  level: number;
};

type User = {
  login: string;
  displayname?: string;
  email?: string;
  phone?: string;
  cursus_users?: Cursus[];
  image?: { link?: string; versions: { medium?: string } };
  wallet?: number;
  correction_point?: number;
  location?: string | null;
  projects_users?: Projects[];
};

type Cursus = {
  cursus_id: number;
  user: User;
  skills: Skill[];
  level: number;
};

export default function DetailsScreen({ route }: { route?: any }) {
  const [user, setUser] = useState<User | null>(null);
  const [mainCursus, setMainCursus] = useState<Cursus | null>(null);
  const [mainCursusProjects, setMainCursusProjects] = useState<Projects[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const { login } = useLocalSearchParams<{ login?: string }>();
  let loginStr = typeof login === 'string' ? login : 'Unknown';
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const setCursus = (cursusList: Cursus[]) => {
      const main = cursusList.find(c => c.cursus_id === 21);
      if (main) setMainCursus(main);
    }

    const setProjects = (projectsList: Projects[]) => {
        const mainProjects = projectsList.filter(p => p.cursus_ids?.includes(21) && p.status === 'finished');
        setMainCursusProjects(mainProjects);
    }
    const fetchUser = async () => {
      if (!loginStr || loginStr === 'Unknown') return;
      setUser(null);
      setMainCursus(null);
      setMainCursusProjects(null);
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const token = await SecureStore.getItemAsync('access_token');
        if (!token) throw new Error('Missing access token');

        const res = await fetch(`https://api.intra.42.fr/v2/users/${encodeURIComponent(loginStr)}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          if (!cancelled) setError('User not found');
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API ${res.status}: ${text}`);
        }

        const data = (await res.json()) as User;

        if (cancelled) return;

        setCursus((data.cursus_users ?? []) as unknown as Cursus[]);
        setProjects((data.projects_users ?? []) as unknown as Projects[]);
        setUser(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [loginStr]);

  const sortedMainProjects = useMemo(() => {
    const list = mainCursusProjects ?? [];
    return [...list].sort((a, b) => {
      const ta = a.updated_at ? Date.parse(a.updated_at) : 0;
      const tb = b.updated_at ? Date.parse(b.updated_at) : 0;
      return tb - ta;
    });
  }, [mainCursusProjects]);

  const backgroundColor = useThemeColor('background');
  const textColor = useThemeColor('text');
  const smallTextColor = useThemeColor('smallText');
  const primaryColor = useThemeColor('primary');
  const disabledColor = useThemeColor('disabled');
  const successColor = '#22c55e';
  const dangerColor = '#ef4444';
  const mutedColor = smallTextColor;
  const isPhoneHidden = !user?.phone || user.phone === 'hidden';
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, color: textColor, fontSize: 30 }}>Loading...</Text>
      </SafeAreaView>
    )
  } else if (notFound || error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: textColor, fontSize: 30 }}>Error: {error}</Text>
      </SafeAreaView>
    )
  }

  return (
<SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
  <ScrollView
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
  >
        <View style={styles.imageContainer}>
          <View style={{ width: 128, height: 128 }}>
            <Image
              source={{ uri: user?.image?.versions?.medium }}
              style={styles.logo}
              resizeMode="cover"
            />
            <View style={styles.statusCircle}>
              <Text style={styles.statusText}>{Math.floor(mainCursus?.level || 0)}</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.fullName, { color: textColor }]}>
          {user?.displayname}
        </Text>
        <Text style={[styles.login, { color: smallTextColor }]}>
          {loginStr} {/* Display the login parameter */}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={() => Linking.openURL(`mailto:${user?.email ?? ''}`)}
          >
            <Ionicons name="mail-outline" size={20} color={textColor} style={{ marginRight: 6 }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isPhoneHidden ? disabledColor : primaryColor },
            ]}
            disabled={isPhoneHidden}
            onPress={() => Linking.openURL(`tel:${user?.phone ?? ''}`)}
          >
            <Ionicons
              name="call-outline"
              size={20}
              color={textColor}
              style={{ marginRight: 6, opacity: isPhoneHidden ? 0.5 : 1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isPhoneHidden ? disabledColor : primaryColor },
            ]}
            disabled={isPhoneHidden}
            onPress={() => Linking.openURL(`sms:${user?.phone ?? ''}`)}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={textColor} style={{ marginRight: 6 }} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 16, marginBottom: 8 }}>
          <ProgressBar leftText='Exp' rightText={mainCursus?.level.toString() || "0"} progress={(mainCursus?.level || 0) % 1} />
        </View>
        <TableGrid data={["Wallets", "Ev. Pts", "Location", user?.wallet ?? 0, user?.correction_point ?? 0, user?.location ?? 'Offline']} />
        <Pressable
  onPress={() => setProjectsOpen(v => !v)}
  style={styles.sectionHeader}
>
  <Text style={[styles.categoryTitle, { color: textColor, marginTop: 0, marginBottom: 0 }]}>
    Projects
  </Text>
  <Ionicons
    name={projectsOpen ? 'chevron-up' : 'chevron-down'}
    size={20}
    color={textColor}
  />
</Pressable>

{projectsOpen ? (
  <View style={styles.projectsContainer}>
    {(sortedMainProjects ?? []).length === 0 ? (
      <Text style={{ color: smallTextColor, paddingVertical: 8 }}>No projects</Text>
    ) : (
      (sortedMainProjects ?? []).map((p, idx) => {
        const title = p.project?.name ?? 'Untitled';
        const hasMark = typeof p.final_mark === 'number';
        const markLabel = hasMark ? String(p.final_mark) : '-';

        const validated = p['validated?'];
        const markColor =
          !hasMark ? mutedColor :
          validated === true ? successColor :
          validated === false ? dangerColor :
          mutedColor;

        return (
          <View key={`${title}-${idx}`} style={styles.projectRow}>
            <Text
              style={[styles.projectTitle, { color: textColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <Text style={[styles.projectMark, { color: markColor }]}>
              {markLabel} {p['validated?'] === null ? '' : p['validated?'] ? '✓' : '✗'}
            </Text>
          </View>
        );
      })
    )}
  </View>
) : null}
<Pressable onPress={() => setSkillsOpen(v => !v)} style={styles.sectionHeader}>
  <Text style={[styles.categoryTitle, { color: textColor, marginTop: 0, marginBottom: 0 }]}>
    Skills
  </Text>
  <Ionicons
    name={skillsOpen ? 'chevron-up' : 'chevron-down'}
    size={20}
    color={textColor}
  />
</Pressable>

{skillsOpen ? (
  <View style={styles.skillsContainer}>
    {(mainCursus?.skills ?? []).length === 0 ? (
      <Text style={{ color: smallTextColor, paddingVertical: 8 }}>No skills</Text>
    ) : (
      [...(mainCursus?.skills ?? [])]
        .sort((a, b) => b.level - a.level)
        .map((s) => (
          <View key={s.id} style={{ marginBottom: 10 }}>
            <ProgressBar
              leftText={s.name}
              rightText={s.level.toFixed(2)}
              progress={Math.max(0, Math.min(1, s.level / 21))}
            />
          </View>
        ))
    )}
  </View>
) : null}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
  },
  imageContainer: {
    marginTop: 16,
    marginBottom: 8,
    position: 'relative',
    alignItems: 'center',
  },
  logo: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#ccc',
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusCircle: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4ADE80',
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    lineHeight: 42,
    includeFontPadding: false,
  },
  login: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '300',
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#4ADE80',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'left',
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectsContainer: {
    paddingVertical: 4,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#00000022',
  },
  projectTitle: {
    flex: 1,
    fontSize: 14,
    paddingRight: 12,
  },
  projectMark: {
    minWidth: 32,
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 14,
  },
  skillsContainer: {
    paddingVertical: 4,
  },
});