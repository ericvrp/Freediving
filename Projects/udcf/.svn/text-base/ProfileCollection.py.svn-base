from BeautifulSoup import BeautifulStoneSoup
from DiveProfile import DiveProfile


class ProfileCollection(object):
	def __init__(self, udcf_string):
		self._dive_profiles = [DiveProfile(sample) for sample in BeautifulStoneSoup(udcf_string).findAll('samples')]

	def diveProfiles(self):
		return self._dive_profiles
