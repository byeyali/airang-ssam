const updateTutor = async (req, res) => {
  try {
    // 파라미터값 세팅
    const id = req.params.id;

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return res.status(404).json({ message: "튜터를 찾을 수 없습니다." });
    }

    // 변경 가능값 지정 (birth_year와 gender 추가)
    const {
      school,
      major,
      is_graduate,
      career_years,
      birth_year,
      gender,
      introduction,
      certification,
    } = req.body;

    // 이미지 업로드시 파일 삭제
    let photo_path = tutor.photo_path;
    if (req.file) {
      if (photo_path && fs.existsSync(photo_path)) {
        fs.unlinkSync(photo_path);
      }
      photo_path = req.file.path;
    }

    // UPDATE 항목 검사 (변경된 경우에만 업데이트)
    const updateData = {};
    if (school !== undefined && school !== tutor.school)
      updateData.school = school;
    if (major !== undefined && major !== tutor.major) updateData.major = major;
    if (is_graduate !== undefined && is_graduate !== tutor.is_graduate)
      updateData.is_graduate = is_graduate;
    if (career_years !== undefined && career_years !== tutor.career_years)
      updateData.career_years = career_years;
    if (birth_year !== undefined && birth_year !== tutor.birth_year)
      updateData.birth_year = birth_year;
    if (gender !== undefined && gender !== tutor.gender)
      updateData.gender = gender;
    if (introduction !== undefined && introduction !== tutor.introduction)
      updateData.introduction = introduction;
    if (certification !== undefined && certification !== tutor.certification)
      updateData.certification = certification;
    if (photo_path !== tutor.photo_path) updateData.photo_path = photo_path;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "변경할 항목이 없습니다." });
    }

    // TABLE UPDATE
    await Tutor.update(updateData, {
      where: { id: id },
    });

    // UPDATE 후 재조회
    const updatedTutor = await Tutor.findByPk(id);
    res.json(updatedTutor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
